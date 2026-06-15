import { resolveCookieNames } from "dbsc-toolkit/dist/core/index.js";
console.log("secure: false =>", resolveCookieNames({ secure: false }));
console.log("cookieScope: site, secure: false =>", resolveCookieNames({ secure: false, cookieScope: "site" }));
console.log("secure: true =>", resolveCookieNames({ secure: true }));
