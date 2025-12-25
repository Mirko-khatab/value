#!/usr/bin/env node

/**
 * Reset Admin Password for ValueArch
 * This script resets the admin password to a new value
 */

const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function resetPassword() {
  console.log("🔐 ValueArch - Reset Admin Password\n");

  // Database configuration
  const dbConfig = {
    host: "localhost",
    user: "root",
    password: "admin123",
    database: "dashboard",
  };

  // New password (change this!)
  const newPassword = "admin123";
  const email = "admin@valuearch.com";

  try {
    // Hash the new password
    console.log("🔒 Hashing password...");
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log("✅ Password hashed");

    // Connect to database
    console.log("📊 Connecting to database...");
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to database");

    // Update password
    console.log(`🔄 Updating password for ${email}...`);
    const [result] = await connection.execute(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    if (result.affectedRows > 0) {
      console.log("✅ Password updated successfully!\n");
      console.log("📋 Login Credentials:");
      console.log("   Email: admin@valuearch.com");
      console.log("   Password: admin123");
      console.log("\n🌐 Login at: https://valuearch.com/login");
    } else {
      console.log("❌ User not found");
    }

    await connection.end();
    console.log("\n✅ Done!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

resetPassword();
