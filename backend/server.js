// server.js
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { parse } = require("csv-parse");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// STATIC FRONTEND
// =======================

// Public pages (dashboard, login, signup)
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Dashboards & internal pages (student / alumni)
app.use(
  "/pages",
  express.static(path.join(__dirname, "../frontend/pages"))
);

// Root URL → dashboard.html (NO index.html)
app.get("/", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/public/dashboard.html")
  );
});

// =======================
// CSV DATA (AI RECOMMENDATION)
// =======================
const dataFolder = path.join(__dirname, "data");
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);

function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }))
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
}

let alumniData = [];
let studentData = [];

async function loadData() {
  try {
    alumniData = await readCSV(path.join(dataFolder, "alumni.csv"));
    studentData = await readCSV(path.join(dataFolder, "students.csv"));
    console.log(
      `Loaded ${alumniData.length} alumni and ${studentData.length} students`
    );
  } catch {
    console.log("CSV files not found, skipping AI data load");
  }
}

// =======================
// DATABASE
// =======================
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "sameer1234",
  database: "alumni_ai_db",
  waitForConnections: true,
  connectionLimit: 10,
});

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result[0]);
    });
  });
}

// =======================
// INIT DATABASE
// =======================
async function initDb() {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('student','alumni','admin') DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const row = await get("SELECT COUNT(*) AS count FROM users");

  if (row.count === 0) {
    const studentPass = await bcrypt.hash("Password123", 10);
    const alumniPass = await bcrypt.hash("alumni123", 10);
    const adminPass = await bcrypt.hash("admin123", 10);

    await run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Student User", "student@example.com", studentPass, "student"]
    );

    await run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Alumni User", "alumni@example.com", alumniPass, "alumni"]
    );

    await run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      ["Admin User", "admin@example.com", adminPass, "admin"]
    );

    console.log("Sample users seeded");
  }
}

// =======================
// AUTH APIs
// =======================

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const exists = await get(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (exists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role || "student"]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await get(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    delete user.password;
    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// =======================
// AI / DATA APIs
// =======================
app.get("/api/profiles", (req, res) => {
  res.json({
    alumni: alumniData,
    students: studentData,
  });
});

// =======================
// START SERVER
// =======================
Promise.all([initDb(), loadData()])
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Startup error:", err));
