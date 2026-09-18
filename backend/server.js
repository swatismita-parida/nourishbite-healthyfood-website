/* ==========================================================
   NOURISHBITE — Backend Server
   Location: backend/server.js
   Features:
   - MongoDB for orders, contacts, reviews
   - Nodemailer for email notifications
   - Static file serving
   ========================================================== */

require("dotenv").config();

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const { MongoClient } = require("mongodb");
const nodemailer = require("nodemailer");

const FRONTEND = path.join(__dirname, "..", "frontend");
const PORT = process.env.PORT || 5000;

/* ---------- MONGODB ---------- */
let db = null;
let ordersCol = null;
let contactsCol = null;
let reviewsCol = null;

async function initDB() {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    db = client.db();
    ordersCol = db.collection("orders");
    contactsCol = db.collection("contacts");
    reviewsCol = db.collection("reviews");
    console.log("  ✅ MongoDB connected");
  } catch (err) {
    console.error("  ❌ MongoDB connection failed:", err.message);
  }
}

/* ---------- NODEMAILER ---------- */
const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOrderEmail(order) {
  try {
    const itemsHTML = order.items
      .map(
        (i) =>
          `<tr>
            <td>${i.name}</td>
            <td style="text-align:center">${i.qty}</td>
            <td style="text-align:right">₹${i.price * i.qty}</td>
          </tr>`
      )
      .join("");

    const html = `
      <h2>🛒 New NourishBite Order</h2>
      <p><b>Order ID:</b> ${order.orderId}</p>
      <p><b>Name:</b> ${order.customer.name}</p>
      <p><b>Phone:</b> ${order.customer.phone}</p>
      <p><b>Email:</b> ${order.customer.email}</p>
      <p><b>Address:</b> ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}</p>
      <p><b>Payment:</b> ${order.customer.payment}</p>
      <h3>Items</h3>
      <table border="1" cellpadding="8" style="border-collapse:collapse;width:100%;max-width:600px">
        <thead>
          <tr><th>Item</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>
      <h3>Total: ₹${order.total}</h3>
      <p style="color:#888;font-size:12px">Received: ${new Date().toLocaleString()}</p>
    `;

    await mailer.sendMail({
      from: `"NourishBite" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `🛒 New Order ${order.orderId} — ₹${order.total}`,
      html,
    });
    console.log("  📧 Order email sent");
  } catch (err) {
    console.error("  ❌ Order email failed:", err.message);
  }
}

async function sendContactEmail(contact) {
  try {
    const html = `
      <h2>📧 New NourishBite Contact Message</h2>
      <p><b>Name:</b> ${contact.name}</p>
      <p><b>Email:</b> ${contact.email}</p>
      <p><b>Message:</b></p>
      <blockquote style="border-left:3px solid #4d9637;padding-left:12px;color:#333">
        ${contact.message}
      </blockquote>
      <p style="color:#888;font-size:12px">Received: ${new Date().toLocaleString()}</p>
    `;

    await mailer.sendMail({
      from: `"NourishBite" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      replyTo: contact.email,
      subject: `📧 Contact from ${contact.name}`,
      html,
    });
    console.log("  📧 Contact email sent");
  } catch (err) {
    console.error("  ❌ Contact email failed:", err.message);
  }
}

/* ---------- HELPERS ---------- */
function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

function serveStatic(res, filePath) {
  const ext = path.extname(filePath);
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  };

  const contentType = mimeTypes[ext] || "application/octet-stream";

  res.writeHead(200, { "Content-Type": contentType });
  fs.createReadStream(filePath).pipe(res);
}

/* ---------- SERVER ---------- */
const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  /* API: POST /api/orders */
  if (req.method === "POST" && pathname === "/api/orders") {
    const order = await readBody(req);
    const orderId = "NB" + Date.now().toString().slice(-7);
    order.orderId = orderId;

    if (ordersCol) {
      try {
        await ordersCol.insertOne({ ...order, createdAt: new Date() });
        console.log("  💾 Order saved to MongoDB");
      } catch (err) {
        console.error("  ❌ MongoDB insert failed:", err.message);
      }
    }

    await sendOrderEmail(order);

    return sendJSON(res, 201, {
      ok: true,
      orderId,
      message: "Order received",
    });
  }

  /* API: POST /api/contact */
  if (req.method === "POST" && pathname === "/api/contact") {
    const contact = await readBody(req);

    if (contactsCol) {
      try {
        await contactsCol.insertOne({ ...contact, createdAt: new Date() });
        console.log("  💾 Contact saved to MongoDB");
      } catch (err) {
        console.error("  ❌ MongoDB insert failed:", err.message);
      }
    }

    await sendContactEmail(contact);

    return sendJSON(res, 201, {
      ok: true,
      message: "Message received",
    });
  }

  /* API: POST /api/reviews */
  if (req.method === "POST" && pathname === "/api/reviews") {
    const review = await readBody(req);

    if (reviewsCol) {
      try {
        await reviewsCol.insertOne({ ...review, createdAt: new Date() });
        console.log("  💾 Review saved to MongoDB");
      } catch (err) {
        console.error("  ❌ MongoDB insert failed:", err.message);
      }
    }

    return sendJSON(res, 201, {
      ok: true,
      message: "Review received",
    });
  }

  /* STATIC FILES */
  let filePath = pathname === "/" ? "/index.html" : pathname;
  filePath = path.normalize(filePath).replace(/^(\.\.[\/\\])+/, "");
  const fullPath = path.join(FRONTEND, filePath);

  if (!fullPath.startsWith(FRONTEND)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/html" });
    return res.end("<h1>404 — Page not found</h1>");
  }

  serveStatic(res, fullPath);
});

/* ---------- START ---------- */
initDB().then(() => {
  server.listen(PORT, () => {
    console.log("");
    console.log("  🥗 NourishBite Server Running");
    console.log("  ─────────────────────────────");
    console.log("  🌐 http://localhost:" + PORT);
    console.log("  📦 MongoDB: connected");
    console.log("  📧 Email: " + process.env.SMTP_USER);
    console.log("");
  });
});