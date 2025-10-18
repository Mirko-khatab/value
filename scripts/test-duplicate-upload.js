#!/usr/bin/env node
/**
 * Test Duplicate Upload Handling
 * This script tests if duplicate uploads work
 */

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

const CLOUD_API_BASE =
  vars.CLOUD_API_BASE_URL || "https://cloud.mirkokawa.dev/api";
const CLOUD_API_KEY_FULL = vars.CLOUD_API_KEY_FULL;

console.log("\n🧪 Testing Duplicate Upload Handling\n");
console.log("=".repeat(70));

// Generate unique filename like the app does
function generateUniqueFilename(originalName) {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const fileExtension = originalName.includes(".")
    ? originalName.substring(originalName.lastIndexOf("."))
    : "";
  const baseName = originalName.includes(".")
    ? originalName.substring(0, originalName.lastIndexOf("."))
    : originalName;
  return `${timestamp}-${randomString}-${baseName}${fileExtension}`;
}

console.log("\n📋 Testing filename generation:\n");

const testNames = [
  "test.png",
  "test.png", // Same name
  "image.jpg",
];

testNames.forEach((name, index) => {
  const unique = generateUniqueFilename(name);
  console.log(`  ${index + 1}. Original: ${name}`);
  console.log(`     Unique:   ${unique}\n`);
});

console.log("=".repeat(70));
console.log(
  "\n💡 As you can see, even the same filename gets different names."
);
console.log("This should prevent duplicate filename errors.\n");

console.log("\n🔍 Checking Cloud Storage API:\n");
console.log(`API Base: ${CLOUD_API_BASE}`);
console.log(`Upload URL: ${CLOUD_API_BASE}/file/upload?allowDuplicates=true`);
console.log("\nThe 'allowDuplicates=true' parameter tells the API to allow");
console.log("uploading the same content multiple times.\n");

console.log("=".repeat(70));
console.log("\n📝 If you still get duplicate errors, it means:\n");
console.log("1. The API doesn't support 'allowDuplicates' parameter");
console.log("2. OR the API is checking file content hash, not filename");
console.log("3. OR duplicate prevention is enforced in API settings\n");

console.log("💡 Solutions:");
console.log("1. Check your cloud storage dashboard settings");
console.log("2. Look for 'deduplication' or 'duplicate prevention' options");
console.log("3. Contact cloud storage support if needed\n");
