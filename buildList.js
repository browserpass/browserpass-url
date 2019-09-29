#!/usr/bin/env node
"use strict";
const process = require("process");
const https = require("https");
const fs = require("fs");

const PUBLICSUFFIX_URL = "https://publicsuffix.org/list/public_suffix_list.dat";
const OUTPUT_FILE = "tld.js";
const TEMPLATE = `"use strict";

const tldList = %TLD_LIST%;

module.exports = {
    tldList
};
`;

let raw = "";
https.get(PUBLICSUFFIX_URL, response => {
    let raw = "";
    response.on("data", buf => {
        raw += buf.toString();
    });
    response.on("end", () => {
        if (!response.complete) {
            console.error("Fetch error: Incomplete response");
            process.exit(1);
        }
        if (response.statusCode !== 200) {
            console.error(`Fetch error: ${response.statusCode} ${response.statusMessage}`);
            process.exit(1);
        }
        parseList(raw);
    });
});

/**
 * Parse TLD list
 *
 * @param string raw Raw list
 */
function parseList(raw) {
    let lines = raw
        .split(/[\r\n]+/)
        .filter(line => !line.match(/^\s*(\/\/.*)?$/))
        .map(line => line.match(/^([^\s]+)/)[0]);
    fs.writeFile(
        OUTPUT_FILE,
        TEMPLATE.replace("%TLD_LIST%", JSON.stringify(lines, null, 4)),
        { mode: 0o644 },
        err => {
            if (err) {
                console.error(`Unable to write output file: ${err.message}`);
                process.exit(1);
            }
        }
    );
}
