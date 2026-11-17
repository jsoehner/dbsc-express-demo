import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";

process.env.MIGRATION = "1";
process.env.LOG_LEVEL = "silent";

const { app, db } = await import("../server.js");

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
  db.close();
});

test("GET /health returns 200 and security headers", async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.deepEqual(body, { status: "ok", db: "connected" });
  assert.equal(res.headers.get("x-content-type-options"), "nosniff");
  assert.ok(res.headers.get("ratelimit-limit"));
});

test("GET /me rejects unauthenticated requests without DBSC proof", async () => {
  const res = await fetch(`${baseUrl}/me`);
  assert.ok(res.status === 401 || res.status === 403, `Expected 401 or 403, got ${res.status}`);
});

test("POST /api/auth/delete-account rejects unauthenticated requests", async () => {
  const res = await fetch(`${baseUrl}/api/auth/delete-account`, {
    method: "POST",
    headers: { "content-type": "application/json" },
  });
  assert.equal(res.status, 401);
});

test("GET /api/crypto/pqc-status reports ML-DSA-65 and hybrid PQC TLS support", async () => {
  const res = await fetch(`${baseUrl}/api/crypto/pqc-status`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.auditSignatureAlgorithm, "ML-DSA-65");
  assert.equal(body.auditSignatureStandard, "NIST FIPS 204");
  assert.equal(typeof body.tlsHybridPqcSupported, "boolean");
  assert.ok(body.auditPublicKey && body.auditPublicKey.length > 0);
});

test("GET / serves CSP-compliant HTML without inline scripts and serves external JS modules", async () => {
  const htmlRes = await fetch(`${baseUrl}/`);
  assert.equal(htmlRes.status, 200);
  const html = await htmlRes.text();
  assert.ok(!/<script(?![^>]*\bsrc=)/i.test(html), "index.html must not contain inline <script> blocks blocked by CSP");

  const interceptorRes = await fetch(`${baseUrl}/js/fetch-interceptor.js`);
  assert.equal(interceptorRes.status, 200);
  const appRes = await fetch(`${baseUrl}/js/app.js`);
  assert.equal(appRes.status, 200);
});
