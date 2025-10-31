import db from "../db/db.js";

// 🧾 Buat order baru
export const createOrder = (req, res, body) => {
  const { user_id, order_type, total_price, status } = JSON.parse(body);

  if (!user_id || !order_type || !total_price) {
    res.writeHead(400);
    return res.end(JSON.stringify({ message: "Missing required fields" }));
  }

  const sql = "INSERT INTO orders (user_id, order_type, total_price, status) VALUES (?, ?, ?, ?)";
  db.query(sql, [user_id, order_type, total_price, status || "pending"], (err, result) => {
    if (err) {
      console.error(err);
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Order creation failed" }));
    }

    res.writeHead(201);
    res.end(JSON.stringify({ message: "Order created", order_id: result.insertId }));
  });
};

// 🚚 Ambil semua order berdasarkan user
export const getOrdersByUser = (req, res, userId) => {
  if (!userId) {
    res.writeHead(400);
    return res.end(JSON.stringify({ message: "User ID required" }));
  }

  const sql = `
    SELECT 
      o.id AS order_id,
      o.order_type,
      o.total_price,
      o.status,
      o.created_at
    FROM orders o
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Database error" }));
    }

    res.writeHead(200);
    res.end(JSON.stringify(results));
  });
};
