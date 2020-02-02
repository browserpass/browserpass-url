"use strict";

const punycode = require("punycode");
const { tldList } = require("./tld.js");

// protocol -> port mapping
const portMap = {
    http: 80,
    https: 443
};

/**
 * Enhanced URL class
 */
module.exports = class extends URL {
    /**
     * Constructor
     *
     * @param string url URL to parse
     * @param string base Base URL
     */
    constructor(url, base) {
        try {
            super(url, base);
        } catch {
            // For all invalid input, initialize fields with guaranteed invalid host
            // https://serverfault.com/a/846523
            super("http://invalid.invalid");
        }

        // if no port is defined, but the protocol port is known, set the port to that
        let rawProtocol = this.protocol.substring(0, this.protocol.length - 1);
        if (!this.port && rawProtocol in portMap) {
            Object.defineProperty(this, "port", {
                value: portMap[rawProtocol].toString(10),
                writable: false,
                enumerable: true
            });
        }

        // set domain components
        let components = getComponents(this.hostname);
        for (let key in components) {
            Object.defineProperty(this, key, {
                value: components[key],
                writable: false,
                enumerable: true
            });
        }
    }

    /**
     * Parse a hostname (with optional port) only, rather than a full URL
     *
     * @param string hostname Hostname
     * @return object Domain information
     */
    static parseHost(hostname) {
        let matches = hostname.match(/(.*?)(?::([0-9]+))?$/);
        let components = getComponents(matches[1]);
        components.port = matches[2] || null;

        return components;
    }
};

/**
 * Check whether the provided hostname is a TLD
 *
 * @param string hostname Hostname to check
 * @return boolean
 */
function isTLD(hostname) {
    hostname = punycode.toUnicode(hostname);
    let isTLD = tldList.includes(hostname);
    if (!isTLD) {
        isTLD = tldList.includes(`*.${hostname}`);
        if (isTLD && tldList.includes(`!${hostname}`)) {
            isTLD = false;
        }
    }
    return isTLD;
}

/**
 * Get the components for a hostname
 *
 * @param string hostname Hostname
 */
function getComponents(hostname) {
    let components = {
        hostname,
        tld: null,
        domain: null,
        subdomain: null,
        validDomain: false
    };
    let parts = hostname.split(/\./);
    for (let i = 0; i < parts.length; i++) {
        let checkTLD = parts.slice(i).join(".");
        if (isTLD(checkTLD)) {
            components.tld = checkTLD;
            if (i > 0) {
                components.validDomain = true;
                components.domain = parts.slice(i - 1).join(".");
                components.subdomain = parts.slice(0, i - 1).join(".");
            }
            break;
        }
    }

    return components;
}
