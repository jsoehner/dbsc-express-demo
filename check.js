import Database from "better-sqlite3";
const db = new Database("db.sqlite");
console.log("dbscSession:", db.prepare("SELECT * FROM dbscSession").all());
console.log("dbscBoundKey:", db.prepare("SELECT * FROM dbscBoundKey").all());
