import http from "http";
import url from "url";
import dotenv from "dotenv";
import "./db/db.js";
import { getAllMenu, getAllCategories, searchMenu, getMenuById } from "./controllers/menuControllers.js";
import { registerUser, loginUser } from "./controllers/userControllers.js";
import { createOrder, getOrdersByUser } from "./controllers/orderControllers.js";


dotenv.config();

const DEFAULT_PORT = 5000;
const PORT = Number.parseInt(process.env.PORT ?? DEFAULT_PORT, 10) || DEFAULT_PORT;

const collectRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1e6) {
        req.destroy();
        reject(new Error("Payload too large"));
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode);
  res.end(JSON.stringify(payload));
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;

  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    if (req.method === "GET" && pathname === "/categories") {
      return getAllCategories(req, res);
    }

    if (req.method === "GET" && pathname === "/menu/search") {
      return searchMenu(req, res, query);
    }

    if (req.method === "GET" && pathname?.startsWith("/menu/")) {
      const [, , menuId] = pathname.split("/");
      if (!menuId) {
        return sendJson(res, 400, { message: "Menu ID required" });
      }
      return getMenuById(req, res, menuId);
    }

    if (req.method === "GET" && pathname === "/menu") {
      return getAllMenu(req, res);
    }

    if (req.method === "GET" && pathname?.startsWith("/orders/")) {
      const [, , userId] = pathname.split("/");
      if (!userId) {
        return sendJson(res, 400, { message: "User ID required" });
      }
      return getOrdersByUser(req, res, userId);
    }

    if (req.method === "POST" && pathname === "/register") {
      const body = await collectRequestBody(req);
      return registerUser(req, res, body);
    }

    if (req.method === "POST" && pathname === "/login") {
      const body = await collectRequestBody(req);
      return loginUser(req, res, body);
    }

    if (req.method === "POST" && pathname === "/order") {
      const body = await collectRequestBody(req);
      return createOrder(req, res, body);
    }

    sendJson(res, 404, { message: "Route not found" });
  } catch (error) {
    console.error("Unhandled server error:", error);
    sendJson(res, 500, { message: "Internal server error" });
  }
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other process or set a different PORT in Backend/.env.`
    );
    process.exit(1);
  }
  throw error;
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
