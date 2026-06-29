import express from "express";
import cookieParser from "cookie-parser";
import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { dbsc } from "@dbsc-toolkit/better-auth";
import { dbsc as dbscMiddleware, requireProof } from "dbsc-toolkit/express";
import { createBetterAuthStorageAdapter } from "@dbsc-toolkit/better-auth/internal";
import { toNodeHandler } from "better-auth/node";
import path from "node:path";
import { createRequire } from "node:module";
import https from "https";
import fs from "fs";

const require = createRequire(import.meta.url);

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

// Initialize SQLite database
const db = new Database("db.sqlite");

// Initialize Better Auth with DBSC plugin
export const auth = betterAuth({
  baseURL: "https://localhost:3000",
  database: db,
  emailAndPassword: { enabled: true },
  session: {
    cookieCache: {
      enabled: true,
    },
    cookie: {
      secure: true,
    },
  },
  plugins: [dbsc({
    onEvent: (evt) => {
      console.log(`\n🔒 [TPM/DBSC Event] type=${evt.type} tier=${evt.tier} session=${evt.sessionId}`);
      if (evt.reason) console.log(`   -> Reason: ${evt.reason}`);
      if (evt.algorithm) console.log(`   -> Algorithm: ${evt.algorithm}`);
    }
  })],
});

// Create storage adapter for the middleware
const ctx = await auth.$context;
const storage = createBetterAuthStorageAdapter(ctx.adapter, ctx.internalAdapter);

const originalGetSession = storage.getSession;
storage.getSession = async function(reqOrId) {
  console.log("getSession called with:", reqOrId);
  const sess = await originalGetSession.call(this, reqOrId);
  console.log("getSession returned:", sess);
  return sess;
};

// Apply DBSC middleware
// Reads the bound cookie + sets the per-request tier on res.locals.dbsc
app.use(dbscMiddleware({ storage }));

// Mount Better Auth API routes (this also mounts /api/auth/dbsc/* routes)
app.use("/api/auth", toNodeHandler(auth));

// Serve the polyfill SDK for the client
const clientDir = path.join(path.dirname(require.resolve("dbsc-toolkit/package.json")), "dist", "client");
app.use("/dbsc-client", express.static(clientDir));

// Guard routes that require device-bound proof using requireProof()
app.get("/me", requireProof(), (req, res) => {
  res.json({ message: "Protected route accessed", dbsc: res.locals.dbsc || null });
});

// Start HTTPS server only if not running migrations
if (!process.env.MIGRATION) {
  const keyPath = fs.existsSync("certs/server.key") ? "certs/server.key" : "server.key";
  const certPath = fs.existsSync("certs/server.cert") ? "certs/server.cert" : "server.cert";
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(options, app).listen(3000, () => {
    console.log("DBSC demo running on https://localhost:3000");
    console.log("NOTE: You will need to accept the self-signed certificate warning in your browser.");
  });
}