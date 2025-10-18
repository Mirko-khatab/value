#!/usr/bin/env node
/**
 * Fix Image URLs in Database
 * Converts direct cloud storage URLs to proxy URLs
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Read .env.local
const envPath = path.join(__dirname, "..", ".env.local");
const vars = {};

try {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    if (line.trim().startsWith("#") || !line.trim()) return;
    const match = line.match(/^([A-Z_]+)=(.+)$/);
    if (match) {
      vars[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  });
} catch (error) {
  console.error("❌ Cannot read .env.local");
  process.exit(1);
}

const dbConfig = {
  host: vars.MYSQL_HOST || "127.0.0.1",
  user: vars.MYSQL_USER || "root",
  password: vars.MYSQL_PASSWORD || "",
  database: vars.MYSQL_DATABASE || "dashboard",
};

const PUBLIC_KEY = vars.CLOUD_API_KEY_READ;

console.log("\n🔧 Fixing Image URLs in Database\n");
console.log("=".repeat(70));

async function fixUrls() {
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected to database\n");

    // Pattern to match: https://cloud.mirkokawa.dev/api/public/{KEY}/{UUID}
    const pattern = `https://cloud.mirkokawa.dev/api/public/${PUBLIC_KEY}/`;
    const replacement = "/api/cloud/files/";

    // Tables and columns that might have image URLs
    const updates = [
      { table: "projects", column: "image_url" },
      { table: "galleries", column: "image_url" },
      { table: "blogs", column: "image_url" },
      { table: "banners", column: "image_url" },
      { table: "banners", column: "video_url" },
      { table: "audios", column: "audio_url" },
      { table: "products", column: "image_url" },
      { table: "products", column: "video_url" },
      { table: "special_projects", column: "image_url" },
      { table: "teams", column: "image_url" },
      { table: "social_media", column: "image_url" },
      { table: "properties", column: "image_url" },
      { table: "quotes", column: "image_url" },
    ];

    let totalFixed = 0;

    for (const { table, column } of updates) {
      try {
        // Check if table exists
        const [tables] = await connection.query(`SHOW TABLES LIKE '${table}'`);

        if (tables.length === 0) {
          console.log(`  ⚠️  Table '${table}' not found, skipping...`);
          continue;
        }

        // Check how many rows need fixing
        const [rows] = await connection.query(
          `SELECT COUNT(*) as count FROM ${table} 
           WHERE ${column} LIKE ?`,
          [`${pattern}%`]
        );

        const count = rows[0].count;

        if (count === 0) {
          console.log(`  ✓ ${table}.${column}: No URLs to fix`);
          continue;
        }

        // Update the URLs
        const [result] = await connection.query(
          `UPDATE ${table} 
           SET ${column} = REPLACE(${column}, ?, ?)
           WHERE ${column} LIKE ?`,
          [pattern, replacement, `${pattern}%`]
        );

        console.log(
          `  ✅ ${table}.${column}: Fixed ${result.affectedRows} URLs`
        );
        totalFixed += result.affectedRows;
      } catch (error) {
        console.log(`  ⚠️  ${table}.${column}: ${error.message}`);
      }
    }

    console.log("\n" + "=".repeat(70));
    console.log(`\n🎉 Total URLs fixed: ${totalFixed}\n`);

    if (totalFixed > 0) {
      console.log("✅ Database updated successfully!");
      console.log("   Refresh your browser - images should now display.\n");
    } else {
      console.log("ℹ️  No URLs needed fixing.");
      console.log(
        "   New uploads will automatically use the correct format.\n"
      );
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

fixUrls();
