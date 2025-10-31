import db from "../db/db.js";

export const getAllMenu = (req, res) => {
  db.query("SELECT * FROM menu_items", (err, results) => {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Database error" }));
    }
    res.writeHead(200);
    res.end(JSON.stringify(results));
  });
};

export const getAllCategories = (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Database error" }));
    }
    res.writeHead(200);
    res.end(JSON.stringify(results));
  });
};

export const getMenuById = (req, res, menuId) => {
  const normalized = String(menuId ?? "").trim();

  if (!normalized) {
    res.writeHead(400);
    return res.end(JSON.stringify({ message: "Menu ID required" }));
  }

  const numericId = Number.parseInt(normalized, 10);
  const lowered = normalized.toLowerCase();

  db.query("SELECT * FROM menu_items", (err, results) => {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Database error" }));
    }

    if (!Array.isArray(results) || results.length === 0) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: "Menu item not found" }));
    }

    const match = results.find((item) => {
      const idValue = item?.id;
      const menuIdValue = item?.menu_id ?? item?.menuId ?? item?.uuid;
      const slugValue = item?.slug ?? item?.slug_name;
      const nameSlug = String(item?.name ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      const idNormalized = String(idValue ?? "").trim();
      const menuIdNormalized = String(menuIdValue ?? "").trim();
      const slugNormalized = String(slugValue ?? "").trim().toLowerCase();

      return (
        String(idValue ?? "").trim() === normalized ||
        String(menuIdValue ?? "").trim() === normalized ||
        idNormalized.toLowerCase() === lowered ||
        menuIdNormalized.toLowerCase() === lowered ||
        slugNormalized === lowered ||
        nameSlug === lowered ||
        (!Number.isNaN(numericId) && Number(idValue) === numericId) ||
        (!Number.isNaN(numericId) && Number(menuIdValue) === numericId)
      );
    });

    if (!match) {
      res.writeHead(404);
      return res.end(JSON.stringify({ message: "Menu item not found" }));
    }

    res.writeHead(200);
    res.end(JSON.stringify(match));
  });
};

// Optional: search & filter
export const searchMenu = (req, res, query) => {
  const { search, category } = query;
  let sql = "SELECT * FROM menu_items WHERE 1=1";
  const params = [];

  if (search) {
    sql += " AND name LIKE ?";
    params.push(`%${search}%`);
  }
  if (category) {
    sql += " AND category_id = ?";
    params.push(category);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      res.writeHead(500);
      return res.end(JSON.stringify({ message: "Database error" }));
    }
    res.writeHead(200);
    res.end(JSON.stringify(results));
  });
};
