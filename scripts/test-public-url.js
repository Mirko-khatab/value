#!/usr/bin/env node
/**
 * Test Public URL Access
 * This script tests if files can be accessed via public URLs
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

console.log("\n🧪 Testing Public URL Access\n");
console.log("=".repeat(70));

async function testPublicAccess() {
  // First, list files to get a file ID
  console.log("\n📋 Step 1: Getting a file ID from your bucket...\n");

  try {
    const response = await fetch(`${CLOUD_API_BASE}/file/list?page=1&limit=1`, {
      headers: {
        "X-API-Key": CLOUD_API_KEY_FULL,
      },
    });

    const data = await response.json();

    if (!data.success || !data.data?.files?.length) {
      console.log("❌ No files found in bucket. Upload a file first.");
      return;
    }

    const file = data.data.files[0];
    console.log(`✅ Found file: ${file.fileName}`);
    console.log(`   File ID: ${file.id}`);
    console.log(`   Size: ${(file.size / 1024).toFixed(1)} KB`);
    console.log(`   Type: ${file.mimeType}`);

    // Test public URL access
    console.log("\n\n📋 Step 2: Testing public URL access...\n");

    const publicUrl = `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${file.id}`;
    console.log(`Public URL: ${publicUrl}`);

    console.log("\n🧪 Method 1: Direct access (no API key in header)...");
    const directResponse = await fetch(publicUrl);

    console.log(`   Status: ${directResponse.status}`);
    console.log(
      `   Content-Type: ${directResponse.headers.get("content-type")}`
    );

    if (directResponse.ok) {
      console.log("   ✅ Public URL works! File is accessible.");
      console.log(
        `   Size: ${directResponse.headers.get("content-length")} bytes`
      );
    } else {
      const errorText = await directResponse.text();
      console.log("   ❌ Public URL failed!");
      console.log(`   Error: ${errorText}`);
    }

    // Test with API key in header
    console.log("\n🧪 Method 2: Access with API key in header...");
    const headerResponse = await fetch(
      `${CLOUD_API_BASE}/public/${CLOUD_API_KEY_READ}/${file.id}`,
      {
        headers: {
          "X-API-Key": CLOUD_API_KEY_READ,
        },
      }
    );

    console.log(`   Status: ${headerResponse.status}`);

    if (headerResponse.ok) {
      console.log("   ✅ Works with API key in header");
    } else {
      console.log("   ❌ Failed even with API key in header");
    }

    // Check what URL format your app generates
    console.log("\n\n📋 Step 3: What URL does your app generate?\n");
    console.log("Your app should store this URL in the database:");
    console.log(`   ${publicUrl}`);
    console.log("\nThis URL should work in:");
    console.log("   - Browser address bar");
    console.log("   - <img> src attribute");
    console.log("   - <video> src attribute");
    console.log("   - Next.js <Image> component");

    // CORS test
    console.log("\n\n📋 Step 4: Checking CORS headers...\n");
    const corsHeaders = [
      "access-control-allow-origin",
      "access-control-allow-methods",
      "access-control-allow-headers",
    ];

    corsHeaders.forEach((header) => {
      const value = directResponse.headers.get(header);
      if (value) {
        console.log(`   ✅ ${header}: ${value}`);
      } else {
        console.log(`   ⚠️  ${header}: Not set`);
      }
    });

    if (!directResponse.headers.get("access-control-allow-origin")) {
      console.log("\n   ⚠️  WARNING: No CORS headers detected.");
      console.log(
        "   This might cause issues loading images from different domains."
      );
    }
  } catch (error) {
    console.log("❌ Error:", error.message);
  }

  console.log("\n" + "=".repeat(70));
  console.log("\n📝 Summary:");
  console.log("If public URL test passed, the file should display in browser.");
  console.log(
    "If it failed, check your cloud storage public access settings.\n"
  );
}

testPublicAccess();
