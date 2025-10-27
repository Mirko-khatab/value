/**
 * Production Database Migration Script
 *
 * Run this to migrate your PRODUCTION database URLs
 * Make sure you have SSH tunnel or direct access to production DB
 */

const mysql = require("mysql2/promise");

// PRODUCTION Database configuration
// Update these with your production database credentials
const dbConfig = {
  host: "your-production-db-host", // e.g., 'valuearch.com' or IP address
  user: "your-production-db-user",
  password: "your-production-db-password",
  database: "dashboard",
  // If using SSH tunnel, use: host: '127.0.0.1', port: 3307
};

// Cloud storage configuration
const CLOUD_API_BASE = "https://cloud.mirkokawa.dev/api";
const CLOUD_API_KEY_READ =
  "9728b284b8658dce9554c9495d3dfc65fa9ad69f1916cfb583c171996ff24a6d";

// Tables and columns to migrate
const migrations = [
  { table: "galleries", column: "image_url" },
  { table: "graphics", column: "image_url" },
  { table: "audios", column: "audio_url" },
  { table: "teams", column: "image_url" },
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

async function main() {
  console.log("🚀 Starting PRODUCTION database migration...\n");
  console.log("⚠️  WARNING: This will modify your PRODUCTION database!");
  console.log("   Press Ctrl+C within 5 seconds to cancel...\n");

  // Give user time to cancel
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Configuration:");
  console.log(`  Database: ${dbConfig.database}@${dbConfig.host}`);
  console.log(`  Cloud API: ${CLOUD_API_BASE}`);
  console.log("");

  let connection;

  try {
    // Connect to database
    console.log("📡 Connecting to PRODUCTION database...");
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

    // Summary
    console.log("\n📊 Migration Summary:");
    console.log(`  ✅ Total updated: ${results.totalUpdated}`);
    console.log(`  ⏭️  Total skipped: ${results.totalSkipped}`);
    console.log(`  ❌ Total errors: ${results.totalErrors}`);
    console.log("");

    if (results.totalErrors === 0) {
      console.log("🎉 PRODUCTION migration completed successfully!\n");
      console.log("Next steps:");
      console.log("  1. Clear CDN cache (if any)");
      console.log("  2. Test image loading on production site");
      console.log("  3. Monitor for any errors");
    } else {
      console.log(
        "⚠️  Migration completed with some errors. Please review the logs above."
      );
    }
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("\nTroubleshooting:");
    console.error("  - Check database credentials");
    console.error("  - Ensure database is accessible (firewall, SSH tunnel)");
    console.error("  - Verify database exists and has correct permissions");
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
