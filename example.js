"use strict";

const BrowserpassURL = require("@browserpass/url");
var url = new BrowserpassURL("http://www.example.com/test");

console.log(url.validDomain); // true
console.log(url.tld); // com
console.log(url.domain); // example.com
console.log(url.subdomain); // www
console.log(url.hostname); // www.example.com

// parse a raw hostname (with optional port), rather than a full URL
var urlDomainOnly = BrowserpassURL.parseHost("www.example.com:8080");
console.log(urlDomainOnly);
/* {
 *    hostname: 'www.example.com',
 *    tld: 'com',
 *    domain: 'example.com',
 *    subdomain: 'www',
 *    validDomain: true,
 *    port: '8080'
 * }
 */
