/**
 * Database Migration Script: Convert Proxy URLs to Direct Cloud URLs
 *
 * This script converts all image/audio URLs from the proxy format:
 *   /api/cloud/files/{fileId}
 *
 * To direct cloud storage URLs:
 *   https://cloud.mirkokawa.dev/api/public/{READ_KEY}/{fileId}
 *
 * This eliminates the need for the proxy and makes loading faster.
 */

const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env.local
function loadEnvFile(filePath) {
  try {
    const envContent = fs.readFileSync(filePath, "utf8");
    const envVars = {};

    envContent.split("\n").forEach((line) => {
      line = line.trim();
      if (!line || line.startsWith("#")) return;

      const [key, ...valueParts] = line.split("=");
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join("=").trim();
      }
    });

    return envVars;
  } catch (error) {
    console.warn(`Warning: Could not load ${filePath}, using defaults`);
    return {};
  }
}

// Try to load from .env.local or .env
const envFile = fs.existsSync(".env.local") ? ".env.local" : ".env";
const envVars = loadEnvFile(envFile);

// Cloud storage configuration
const CLOUD_API_BASE = "https://cloud.mirkokawa.dev/api";
const CLOUD_API_KEY_READ =
  "csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4";

// Database configuration
const dbConfig = {
  host: envVars.MYSQL_HOST || "127.0.0.1",
  user: envVars.MYSQL_USER || "admin",
  password: envVars.MYSQL_PASSWORD || "gM7-3$F<1&4^!",
  database: envVars.MYSQL_DATABASE || "dashboard",
};

// Tables and columns to migrate
const migrations = [
  { table: "galleries", column: "image_url" },
  { table: "graphics", column: "image_url" },
  { table: "audios", column: "audio_url" },
  { table: "teams", column: "image_url" },
  { table: "properties", column: "image_url" },
  { table: "social_media", column: "image_url" },
];

async function migrateTable(connection, tableName, columnName) {
  try {
    console.log(`\n📊 Migrating ${tableName}.${columnName}...`);

    // Check if table exists
    const [tables] = await connection.query(`SHOW TABLES LIKE '${tableName}'`);

    if (tables.length === 0) {
      console.log(`  ⚠️  Table ${tableName} does not exist, skipping...`);
      return { updated: 0, skipped: 0, errors: 0 };
    }

    // Get all rows with proxy URLs
    const [rows] = await connection.execute(
      `SELECT id, ${columnName} FROM ${tableName} WHERE ${columnName} LIKE '/api/cloud/files/%'`
    );

    console.log(`  Found ${rows.length} rows with proxy URLs`);

    if (rows.length === 0) {
      return { updated: 0, skipped: 0, errors: 0 };
    }

    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (const row of rows) {
      try {
        const oldUrl = row[columnName];

        // Extract file ID from /api/cloud/files/{fileId}
        const match = oldUrl.match(/\/api\/cloud\/files\/([a-f0-9-]+)/i);

        if (!match || !match[1]) {
          console.log(`  ⚠️  Could not extract file ID from: ${oldUrl}`);
          skipped++;
          continue;
        }

        const fileId = match[1];
        const newUrl = `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${fileId}`;

        // Update the row
        await connection.execute(
          `UPDATE ${tableName} SET ${columnName} = ? WHERE id = ?`,
          [newUrl, row.id]
        );

        updated++;

        if (updated % 10 === 0) {
          console.log(`  ✓ Updated ${updated}/${rows.length} rows...`);
        }
      } catch (error) {
        console.error(`  ❌ Error updating row ${row.id}:`, error.message);
        errors++;
      }
    }

    console.log(
      `  ✅ Complete: ${updated} updated, ${skipped} skipped, ${errors} errors`
    );

    return { updated, skipped, errors };
  } catch (error) {
    console.error(
      `  ❌ Error migrating ${tableName}.${columnName}:`,
      error.message
    );
    return { updated: 0, skipped: 0, errors: 1 };
  }
}

async function verifyMigration(connection, tableName, columnName) {
  try {
    // Check for any remaining proxy URLs
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count FROM ${tableName} WHERE ${columnName} LIKE '/api/cloud/files/%'`
    );

    const remaining = rows[0].count;
    if (remaining > 0) {
      console.log(
        `  ⚠️  ${tableName}.${columnName} still has ${remaining} proxy URLs`
      );
      return false;
    }

    // Check for new cloud URLs
    const [cloudRows] = await connection.execute(
      `SELECT COUNT(*) as count FROM ${tableName} WHERE ${columnName} LIKE '%cloud.mirkokawa.dev/api/public/%'`
    );

    const migrated = cloudRows[0].count;
    console.log(`  ✓ ${tableName}.${columnName} has ${migrated} cloud URLs`);
    return true;
  } catch (error) {
    console.log(`  ⚠️  Could not verify ${tableName}.${columnName}`);
    return false;
  }
}

async function main() {
  console.log("🚀 Starting database migration to direct cloud URLs...\n");
  console.log("Configuration:");
  console.log(`  Database: ${dbConfig.database}@${dbConfig.host}`);
  console.log(`  Cloud API: ${CLOUD_API_BASE}`);
  console.log(`  Read Key: ${CLOUD_API_KEY_READ.substring(0, 20)}...`);
  console.log("");

  let connection;

  try {
    // Connect to database
    console.log("📡 Connecting to database...");
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected!\n");

    // Run migrations
    const results = {
      totalUpdated: 0,
      totalSkipped: 0,
      totalErrors: 0,
    };

    for (const migration of migrations) {
      const result = await migrateTable(
        connection,
        migration.table,
        migration.column
      );
      results.totalUpdated += result.updated;
      results.totalSkipped += result.skipped;
      results.totalErrors += result.errors;
    }

    // Verify migrations
    console.log("\n🔍 Verifying migration...\n");
    for (const migration of migrations) {
      await verifyMigration(connection, migration.table, migration.column);
    }

    // Summary
    console.log("\n📊 Migration Summary:");
    console.log(`  ✅ Total updated: ${results.totalUpdated}`);
    console.log(`  ⏭️  Total skipped: ${results.totalSkipped}`);
    console.log(`  ❌ Total errors: ${results.totalErrors}`);
    console.log("");

    if (results.totalErrors === 0) {
      console.log("🎉 Migration completed successfully!\n");
      console.log("Next steps:");
      console.log(
        "  1. Update next.config.ts to allow cloud.mirkokawa.dev domain"
      );
      console.log("  2. Add NEXT_PUBLIC_CLOUD_* env vars to production");
      console.log("  3. Rebuild and deploy your app");
      console.log("  4. Test image loading on production");
    } else {
      console.log(
        "⚠️  Migration completed with some errors. Please review the logs above."
      );
    }
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log("\n👋 Database connection closed.");
    }
  }
}

// Run migration
main().catch(console.error);
