import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

import { Logger } from "../../shared/logger/logger";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 */
export interface User {
  id: number;
  name: string;
  email: string;
}

export class UserController {
  private readonly logger: Logger;
  private readonly db: Database;

  private constructor(db: Database, logger: Logger) {
    this.db = db;
    this.logger = logger;
  }

  static async create(deps: { logger: Logger; }): Promise<UserController> {
    const db = await open({
      filename: "db/users.sqlite",
      driver: sqlite3.Database,
    });

    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `);

    deps.logger.info("SQLite database initialized");
    return new UserController(db, deps.logger);
  }

  /**
   * @openapi
   * /api/users:
   *   post:
   *     summary: Create a new user
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       201:
   *         description: User created
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Invalid input
   *       409:
   *         description: User already exists
   */
  createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;

    if (!name || !email) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid user data" });
    }

    try {
      const result = await this.db.run(
        `INSERT INTO users (name, email) VALUES (?, ?)`,
        name,
        email
      );

      return res.status(StatusCodes.CREATED).json({
        id: result.lastID,
        name,
        email,
      });
    } catch (err: any) {
      if (err.code === "SQLITE_CONSTRAINT") {
        return res
          .status(StatusCodes.CONFLICT)
          .json({ error: "User already exists" });
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

  /**
   * @openapi
   * /api/users/{id}:
   *   get:
   *     summary: Get user by ID
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: User found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       404:
   *         description: User not found
   */
  getUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await this.db.get<User>(
      `SELECT * FROM users WHERE id = ?`,
      id
    );

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    return res.status(StatusCodes.OK).json(user);
  };

  /**
   * @openapi
   * /api/users/search:
   *   get:
   *     summary: Find user by email and/or name
   *     parameters:
   *       - in: query
   *         name: email
   *         schema:
   *           type: string
   *       - in: query
   *         name: name
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       400:
   *         description: Missing query parameters
   *       404:
   *         description: User not found
   */
  findUser = async (req: Request, res: Response) => {
    const { email, name } = req.query as {
      email?: string;
      name?: string;
    };

    if (!email && !name) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "At least email or name must be provided" });
    }

    const conditions: string[] = [];
    const params: unknown[] = [];

    if (email) {
      conditions.push("email = ?");
      params.push(email);
    }

    if (name) {
      conditions.push("name = ?");
      params.push(name);
    }

    const user = await this.db.get<User>(
      `SELECT * FROM users WHERE ${conditions.join(" AND ")}`,
      ...params
    );

    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    return res.status(StatusCodes.OK).json(user);
  };

  /**
   * @openapi
   * /api/users:
   *   get:
   *     summary: Get all users
   *     responses:
   *       200:
   *         description: List of users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/User'
   */
  getAllUsers = async (_req: Request, res: Response) => {
    const users = await this.db.all<User[]>(`SELECT * FROM users`);
    return res.status(StatusCodes.OK).json(users);
  };

  /**
   * @openapi
   * /api/users/{id}:
   *   put:
   *     summary: Update a user
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: Updated user
   *       404:
   *         description: User not found
   */
  updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;

    const result = await this.db.run(
      `
      UPDATE users
      SET name = COALESCE(?, name),
          email = COALESCE(?, email)
      WHERE id = ?
      `,
      name,
      email,
      id
    );

    if (result.changes === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const updated = await this.db.get<User>(
      `SELECT * FROM users WHERE id = ?`,
      id
    );

    return res.status(StatusCodes.OK).json(updated);
  };

  /**
   * @openapi
   * /api/users/{id}:
   *   delete:
   *     summary: Delete a user
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: User deleted
   *       404:
   *         description: User not found
   */
  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await this.db.run(
      `DELETE FROM users WHERE id = ?`,
      id
    );

    if (result.changes === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    return res.sendStatus(StatusCodes.NO_CONTENT);
  };
}
