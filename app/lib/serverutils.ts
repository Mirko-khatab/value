"use server";
import mysql from "mysql2/promise";

export async function getConnection() {
  // Skip database connection during build time
  if (
    process.env.NODE_ENV === "production" &&
    (process.env.NEXT_PHASE === "phase-production-build" || 
     process.env.npm_lifecycle_event === "build")
  ) {
    throw new Error("Database connection skipped during build time");
  }

  // Also check if we're in a build context by looking for build-specific environment
  if (process.env.NEXT_BUILD || process.env.CI) {
    throw new Error("Database connection skipped during build time");
  }

  // Check if database environment variables are set
  if (
    !process.env.MYSQL_HOST ||
    !process.env.MYSQL_USER ||
    !process.env.MYSQL_PASSWORD ||
    !process.env.MYSQL_DATABASE
  ) {
    throw new Error(
      "Database configuration not available. Please set MYSQL environment variables."
    );
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });
    return connection;
  } catch (error) {
    console.warn("Database connection failed:", error);
    throw new Error(
      "Database connection failed. Please ensure the database server is running."
    );
  }
}
