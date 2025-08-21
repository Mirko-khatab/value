import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
}

async function seedUsers(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await connection.execute(
      `INSERT INTO users (id, name, email, password) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [user.id, user.name, user.email, hashedPassword]
    );
  }
}

async function seedInvoices(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS invoices (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      customer_id VARCHAR(36) NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    )
  `);

  for (const invoice of invoices) {
    await connection.execute(
      `INSERT INTO invoices (customer_id, amount, status, date) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE amount=VALUES(amount)`,
      [invoice.customer_id, invoice.amount, invoice.status, invoice.date]
    );
  }
}

async function seedCustomers(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    )
  `);

  for (const customer of customers) {
    await connection.execute(
      `INSERT INTO customers (id, name, email, image_url) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [customer.id, customer.name, customer.email, customer.image_url]
    );
  }
}

async function seedRevenue(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL,
      PRIMARY KEY (month)
    )
  `);

  for (const rev of revenue) {
    await connection.execute(
      `INSERT INTO revenue (month, revenue) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE revenue=VALUES(revenue)`,
      [rev.month, rev.revenue]
    );
  }
}

export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    await seedUsers(connection);
    await seedCustomers(connection);
    await seedInvoices(connection);
    await seedRevenue(connection);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
