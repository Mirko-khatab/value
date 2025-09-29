#!/usr/bin/env node

/**
 * Video Optimization Script for Loading System
 *
 * This script helps optimize video files for the loading system.
 * It creates multiple formats and sizes for better compatibility.
 *
 * Requirements:
 * - FFmpeg installed on your system
 * - Node.js to run this script
 *
 * Usage:
 * node scripts/optimize-video.js input-video.mov
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const inputFile = process.argv[2];

if (!inputFile) {
  console.error("Usage: node scripts/optimize-video.js <input-video-file>");
  process.exit(1);
}

if (!fs.existsSync(inputFile)) {
  console.error(`Input file not found: ${inputFile}`);
  process.exit(1);
}

const outputDir = path.join(__dirname, "../public/video");
const baseName = path.basename(inputFile, path.extname(inputFile));

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("🎬 Optimizing video for loading system...\n");

try {
  // Create MP4 version (H.264, optimized for web)
  console.log("📱 Creating MP4 version...");
  execSync(
    `ffmpeg -i "${inputFile}" -c:v libx264 -preset fast -crf 23 -c:a aac -b:a 128k -movflags +faststart -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" "${outputDir}/${baseName}.mp4"`,
    { stdio: "inherit" }
  );

  // Create WebM version (VP9, smaller file size)
  console.log("🌐 Creating WebM version...");
  execSync(
    `ffmpeg -i "${inputFile}" -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" "${outputDir}/${baseName}.webm"`,
    { stdio: "inherit" }
  );

  // Create mobile-optimized version (smaller resolution)
  console.log("📱 Creating mobile-optimized version...");
  execSync(
    `ffmpeg -i "${inputFile}" -c:v libx264 -preset fast -crf 25 -c:a aac -b:a 96k -movflags +faststart -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" "${outputDir}/${baseName}-mobile.mp4"`,
    { stdio: "inherit" }
  );

  // Create poster image (first frame)
  console.log("🖼️ Creating poster image...");
  execSync(
    `ffmpeg -i "${inputFile}" -vframes 1 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" "${outputDir}/${baseName}-poster.jpg"`,
    { stdio: "inherit" }
  );

  // Copy original MOV file if it's not already there
  const originalDest = path.join(outputDir, `${baseName}.MOV`);
  if (!fs.existsSync(originalDest)) {
    console.log("📁 Copying original MOV file...");
    fs.copyFileSync(inputFile, originalDest);
  }

  console.log("\n✅ Video optimization complete!");
  console.log("\n📁 Generated files:");
  console.log(`   - ${baseName}.MOV (original)`);
  console.log(`   - ${baseName}.mp4 (web optimized)`);
  console.log(`   - ${baseName}.webm (web optimized)`);
  console.log(`   - ${baseName}-mobile.mp4 (mobile optimized)`);
  console.log(`   - ${baseName}-poster.jpg (poster image)`);

  console.log("\n📋 Next steps:");
  console.log("1. Test the videos in your browser");
  console.log("2. Update the video source paths if needed");
  console.log("3. Consider using the mobile version for smaller screens");
  console.log("4. Use the poster image for faster initial display");
} catch (error) {
  console.error("❌ Error optimizing video:", error.message);
  console.log("\n💡 Make sure FFmpeg is installed:");
  console.log("   - macOS: brew install ffmpeg");
  console.log("   - Ubuntu: sudo apt install ffmpeg");
  console.log("   - Windows: Download from https://ffmpeg.org/");
  process.exit(1);
}

