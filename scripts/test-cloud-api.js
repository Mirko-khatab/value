#!/usr/bin/env node
/**
 * Test Cloud Storage API Connection
 * This script tests if your API keys work with the cloud storage
 */

const fs = require("fs");
const path = require("path");

// Read .env.local file
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

const CLOUD_API_BASE =
  vars.CLOUD_API_BASE_URL || "https://cloud.mirkokawa.dev/api";
const CLOUD_API_KEY_FULL = vars.CLOUD_API_KEY_FULL;
const CLOUD_API_KEY_READ = vars.CLOUD_API_KEY_READ;

console.log("\n🧪 Testing Cloud Storage API Connection\n");
console.log("=".repeat(70));

if (!CLOUD_API_KEY_FULL) {
  console.error("\n❌ ERROR: CLOUD_API_KEY_FULL not found in .env.local");
  console.log("\nAdd to .env.local:");
  console.log(
    "CLOUD_API_KEY_FULL=199a1ce360f6f611f8853e3adf7185ec9ec80840582e131de4551437869c52fb"
  );
  process.exit(1);
}

if (!CLOUD_API_KEY_READ) {
  console.error("\n❌ ERROR: CLOUD_API_KEY_READ not found in .env.local");
  console.log("\nAdd to .env.local:");
  console.log(
    "CLOUD_API_KEY_READ=2502c9328668e21504c05c1eebc7c767b70762f82cf7d3e4ce0878f0a98c04e0"
  );
  process.exit(1);
}

async function testAPI() {
  console.log("\n📋 Configuration:");
  console.log(`  API Base: ${CLOUD_API_BASE}`);
  console.log(
    `  Admin Key: ${CLOUD_API_KEY_FULL.substring(
      0,
      10
    )}...${CLOUD_API_KEY_FULL.substring(CLOUD_API_KEY_FULL.length - 10)} (${
      CLOUD_API_KEY_FULL.length
    } chars)`
  );
  console.log(
    `  Public Key: ${CLOUD_API_KEY_READ.substring(
      0,
      10
    )}...${CLOUD_API_KEY_READ.substring(CLOUD_API_KEY_READ.length - 10)} (${
      CLOUD_API_KEY_READ.length
    } chars)`
  );

  // Test 1: List files with Admin Key
  console.log("\n\n🧪 Test 1: List Files (Admin Key)");
  console.log("-".repeat(70));
  try {
    const response = await fetch(`${CLOUD_API_BASE}/file/list?page=1&limit=5`, {
      headers: {
        "X-API-Key": CLOUD_API_KEY_FULL,
      },
    });

    const data = await response.json();

    console.log(`Status: ${response.status}`);

    if (response.ok && data.success) {
      console.log("✅ Admin key works!");
      console.log(
        `   Total files in bucket: ${data.data?.pagination?.total || 0}`
      );
      if (data.data?.files?.length > 0) {
        console.log(`   Sample files:`);
        data.data.files.slice(0, 3).forEach((file) => {
          console.log(
            `     - ${file.fileName} (${(file.size / 1024).toFixed(1)} KB)`
          );
        });
      }
    } else {
      console.log("❌ Admin key FAILED");
      console.log("   Response:", JSON.stringify(data, null, 2));

      if (data.message?.includes("Invalid or inactive API key")) {
        console.log("\n⚠️  API Key Issue Detected!");
        console.log("\n   Possible causes:");
        console.log("   1. Wrong API key copied from cloud dashboard");
        console.log("   2. Extra spaces or quotes in .env.local");
        console.log("   3. API key was regenerated/deactivated");
        console.log("   4. Wrong bucket or key permissions");
        console.log("\n   Your current key:");
        console.log(`   ${CLOUD_API_KEY_FULL}`);
        console.log("\n   Expected format: 64 hexadecimal characters");
        console.log(`   Your key length: ${CLOUD_API_KEY_FULL.length}`);
      }
    }
  } catch (error) {
    console.log("❌ Network error:", error.message);
  }

  // Test 2: List files with Public Key
  console.log("\n\n🧪 Test 2: List Files (Public Key - Read Only)");
  console.log("-".repeat(70));
  try {
    const response = await fetch(`${CLOUD_API_BASE}/file/list?page=1&limit=5`, {
      headers: {
        "X-API-Key": CLOUD_API_KEY_READ,
      },
    });

    const data = await response.json();

    console.log(`Status: ${response.status}`);

    if (response.ok && data.success) {
      console.log("✅ Public key works!");
      console.log(`   Can read ${data.data?.pagination?.total || 0} files`);
    } else {
      console.log("❌ Public key FAILED");
      console.log("   Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.log("❌ Network error:", error.message);
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n📝 Summary:");
  console.log("Both keys must pass for upload/display to work.");
  console.log("If keys fail, verify them in your cloud storage dashboard.\n");
}

testAPI();
