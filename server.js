import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
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

// Apply security headers
app.use(helmet());

// Apply CORS restrictions
app.use(cors({
  origin: process.env.BASE_URL || "http://localhost:3000",
  credentials: true
}));

// Apply Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(express.json({ limit: '10kb' })); // Limit JSON payload size
app.use(cookieParser());
app.use(express.static("public"));

// Initialize SQLite database
const db = new Database("db.sqlite");

// Initialize Better Auth with DBSC plugin
export const auth = betterAuth({
  baseURL: process.env.BASE_URL || "http://localhost:3000",
  database: db,
  emailAndPassword: { enabled: true },
  session: {
    cookieCache: {
      enabled: true,
    },
    cookie: {
      secure: process.env.NODE_ENV === "production",
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
  const keyPath = path.resolve(process.env.HTTPS_KEY_PATH || "certs/server.key");
  const certPath = path.resolve(process.env.HTTPS_CERT_PATH || "certs/server.cert");

  if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
    console.error(`❌ SSL Certificates not found. Please provide HTTPS_KEY_PATH and HTTPS_CERT_PATH or place certs in certs/`);
    console.error(`Looking for: ${keyPath} and ${certPath}`);
    process.exit(1);
  }

  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };

  https.createServer(options, app).listen(3000, () => {
    const host = new URL(process.env.BASE_URL || "http://localhost:3000").host;
    console.log(`DBSC demo running on https://${host}:3000`);
    console.log("NOTE: You will need to accept the self-signed certificate warning in your browser.");
  });
}