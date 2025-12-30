# Server API

A lightweight REST API server built with **Express 5**, **TypeScript**, and **SQLite**, featuring **Swagger (OpenAPI)** documentation for quick testing and exploration.

---

## ✨ Tech Stack

- Node.js
- Express 5
- TypeScript
- SQLite
- Swagger (OpenAPI 3.0)
- dotenv
- cors

---

## 🗄 Database Details

This server uses SQLite as its persistence layer.

Database Details

Database file location:

```bash
db/users.sqlite
```

The database file is created automatically on first run

Tables are initialized at runtime if they do not exist

No external database server is required

## 📦 Installation

```bash
npm install
```

---

## 🚀 Development

```bash
npm run dev
```

---

## 🏗 Build

```bash
npm run build
```

---

## ▶️ Production

```bash
npm start
```

---

## 📘 Swagger Documentation

Once the server is running, open:

```html
http://localhost:3000/api/docs
```

Swagger UI allows you to explore and test all endpoints directly.

---

## 🧪 OpenAPI JSDoc Example

```ts
/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */
```