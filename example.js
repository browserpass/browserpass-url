"use strict";

const BrowserPassURL = require("@browserpass/url");
var url = new BrowserPassURL("http://www.example.com/test");

console.log(url.validDomain); // true
console.log(url.tld); // com
console.log(url.domain); // example.com
console.log(url.subdomain); // www
