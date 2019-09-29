# BrowserPassURL

This package is an extension of the built-in [URL][1] class, which adds some additional properties based on the domain.

The TLD list used by this module is downloaded from [publicsuffix.org][2] when building, if it's older than one day.

[1]: https://developer.mozilla.org/en-US/docs/Web/API/URL
[2]: https://publicsuffix.org/

## Usage

```JS
const BrowserPassURL = require("@browserpass/url");
var url = new BrowserPassURL("http://www.example.com/test");

console.log(url.validDomain); // true
console.log(url.tld); // com
console.log(url.domain); // example.com
console.log(url.subdomain); // www
console.log(url.hostname); // www.example.com

// parse a raw hostname (with optional port), rather than a full URL
var urlDomainOnly = BrowserPassURL.parseHost("www.example.com:8080");
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
```

## Extra Properties

| Property    | Description                                     |
| ----------- | ----------------------------------------------- |
| validDomain | Whether the URL contains a valid, public domain |
| tld         | The public TLD component of the domain          |
| domain      | The registered domain root                      |
| subdomain   | The subdomain portion of the hostname           |
