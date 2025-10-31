import bcrypt from "bcrypt";
import db from "../db/db.js";

export const registerUser = async (req, res, body) => {
  const { name, email, password } = JSON.parse(body);

  // Cek email sudah terdaftar
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Database error" }));
    }

    if (results.length > 0) {
      res.writeHead(400);
      return res.end(JSON.stringify({ message: "Email already registered" }));
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err) => {
        if (err) {
          res.writeHead(500);
          return res.end(JSON.stringify({ message: "Register failed" }));
        }
        res.writeHead(201);
        res.end(JSON.stringify({ message: "User registered successfully" }));
      }
    );
  });
};

export const loginUser = async (req, res, body) => {
  const { email, password } = JSON.parse(body);

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Database error" }));
    }

    if (results.length === 0) {
      res.writeHead(401);
      return res.end(JSON.stringify({ message: "User not found" }));
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.writeHead(401);
      return res.end(JSON.stringify({ message: "Invalid password" }));
    }

    res.writeHead(200);
    res.end(JSON.stringify({ message: "Login successful", user_id: user.id, name: user.name }));
  });
};
