#!/usr/bin/env node

/**
 * AI-Powered Bulk Project Upload Script
 *
 * Uses Google Gemini AI to analyze project images and automatically:
 * - Generate titles (English, Kurdish, Arabic)
 * - Generate descriptions (English, Kurdish, Arabic)
 * - Select appropriate category and subcategory
 * - Upload images to cloud storage
 * - Create projects in database
 *
 * Usage:
 *   node scripts/ai-bulk-upload-projects.js
 *
 * Folder structure expected:
 *   Selected Folder/
 *     ├── Project 1/
 *     │   ├── image1.jpg
 *     │   ├── image2.jpg
 *     │   └── ...
 *     ├── Project 2/
 *     │   ├── image1.jpg
 *     │   └── ...
 *     └── ...
 */

const fs = require("fs").promises;
const path = require("path");
const mysql = require("mysql2/promise");
const FormData = require("form-data");
const fetch = require("node-fetch");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");
const inquirer = require("inquirer");
const { execSync } = require("child_process");

// Configuration
const CONFIG = {
  // Database
  db: {
    host: "localhost",
    user: "root",
    password: "admin123",
    database: "dashboard",
  },

  // Cloud Storage API
  cloudAPI: {
    baseURL: "https://api.mirkokawa.dev/api",
    apiKey:
      process.env.CLOUD_API_KEY || "AIzaSyCqbDabQwPvabz-IBOujmqn6VCo82vwKkg",
  },

  // Google AI Studio (Gemini)
  geminiApiKey: "AIzaSyCqbDabQwPvabz-IBOujmqn6VCo82vwKkg",

  // Supported image formats
  imageExtensions: [".jpg", ".jpeg", ".png", ".webp", ".gif"],

  // Categories (from database)
  categories: {
    4: {
      en: "Residential Complex",
      ku: "کۆمەڵگەی نیشتەجێبوون",
      ar: "مجمع سكني",
    },
    5: {
      en: "Landscape Design",
      ku: "دیزاینی باخچە",
      ar: "تصميم المناظر الطبيعية",
    },
    6: { en: "Exterior Design", ku: "دیزاینی دەرەوە", ar: "تصميم خارجي" },
    7: { en: "Interior Design", ku: "دیزاینی ناوەوە", ar: "تصميم داخلي" },
    8: {
      en: "Urban Design & Siteplanning",
      ku: "دیزاینی شار و پلاندانانی شوێن",
      ar: "التصميم الحضري وتخطيط الموقع",
    },
    10: { en: "Proposal", ku: "پێشنیاز", ar: "اقتراح" },
  },

  // Subcategories
  subcategories: {
    7: [
      // Interior Design
      {
        id: 1,
        en: "Residential Interiors",
        ku: "دیزاینی ناوخۆی نیشتەجێبوون",
        ar: "تصميمات داخلية سكنية",
      },
      {
        id: 3,
        en: "Health Care Interiors",
        ku: "دیزاینی ناوخۆی چاودێری تەندروستی",
        ar: "تصميمات داخلية للرعاية الصحية",
      },
      {
        id: 4,
        en: "Restaurant and Cafe",
        ku: "ڕێستورانت و کافێ",
        ar: "مطعم ومقهى",
      },
      {
        id: 5,
        en: "Retail / Shop / Outlet",
        ku: "فرۆشگا / دوکان / مەخزەن",
        ar: "محل بيع بالتجزئة / دكان / منفذ بيع",
      },
      { id: 6, en: "Industrial", ku: "پیشەسازی", ar: "صناعي" },
      { id: 7, en: "Hotel", ku: "هۆتێل", ar: "فندق" },
      { id: 8, en: "Educational", ku: "پەروەردەیی", ar: "تعليمي" },
      {
        id: 9,
        en: "Cultural / Public",
        ku: "کلتوری / گشتی",
        ar: "ثقافي / عام",
      },
      {
        id: 10,
        en: "Wellness and Entertainment",
        ku: "تەندروستی و کات بەسەربردن",
        ar: "العافية والترفيه",
      },
    ],
    6: [
      // Exterior Design
      { id: 11, en: "Residential", ku: "نیشتەجێبوون", ar: "سكني" },
      { id: 12, en: "Commercial", ku: "بازرگانی", ar: "تجاري" },
      {
        id: 13,
        en: "Retrofit Facade",
        ku: "نوێکردنەوەی ڕووکار",
        ar: "تعديل الواجهة",
      },
      {
        id: 14,
        en: "Cultural / Public",
        ku: "کلتوری / گشتی",
        ar: "ثقافي / عام",
      },
      {
        id: 15,
        en: "Health Care Exteriors",
        ku: "دەرەوەی چاودێری تەندروستی",
        ar: "واجهات الرعاية الصحية",
      },
    ],
  },
};

// Initialize Gemini AI
let genAI;
let model;

try {
  if (
    !CONFIG.geminiApiKey ||
    CONFIG.geminiApiKey === "your-gemini-api-key-here"
  ) {
    console.error("❌ Error: GEMINI API_KEY not found in .env file!");
    console.log("\n📝 Please add to your .env.local file:");
    console.log("API_KEY=your-google-ai-studio-key-here\n");
    process.exit(1);
  }

  genAI = new GoogleGenerativeAI(CONFIG.geminiApiKey);
  model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} catch (error) {
  console.error("❌ Error initializing Gemini AI:", error.message);
  process.exit(1);
}

// Utility Functions
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function selectFolderWithDialog() {
  console.log("\n📂 Folder Selection Options:\n");

  const { method } = await inquirer.prompt([
    {
      type: "list",
      name: "method",
      message: "How would you like to select the folder?",
      choices: [
        { name: "🖱️  Use macOS Folder Picker (Visual)", value: "picker" },
        { name: "📋 Type/Paste the path manually", value: "manual" },
        { name: "🗂️  Browse folders interactively", value: "browse" },
      ],
    },
  ]);

  if (method === "picker") {
    return await selectFolderWithMacPicker();
  } else if (method === "browse") {
    return await browseFolders();
  } else {
    return await selectFolderManually();
  }
}

async function selectFolderWithMacPicker() {
  try {
    console.log("\n🖱️  Opening folder picker dialog...");
    console.log(
      "   (Select the main folder containing your project subfolders)"
    );

    const appleScript = `
      tell application "System Events"
        activate
        set folderPath to choose folder with prompt "Select the main folder containing project subfolders"
        return POSIX path of folderPath
      end tell
    `;

    const selectedPath = execSync(`osascript -e '${appleScript}'`, {
      encoding: "utf8",
    }).trim();

    if (selectedPath) {
      console.log(`✅ Selected: ${selectedPath}`);
      return selectedPath;
    }
  } catch (error) {
    if (error.message.includes("User canceled")) {
      console.log("❌ Folder selection cancelled");
      return null;
    }
    console.error("❌ Error with folder picker:", error.message);
    console.log("Falling back to manual entry...\n");
    return await selectFolderManually();
  }
}

async function selectFolderManually() {
  const { folderPath } = await inquirer.prompt([
    {
      type: "input",
      name: "folderPath",
      message: "📂 Enter the full path to the folder:",
      default: "/Users/miko/Desktop",
      validate: async (input) => {
        if (!input) return "Please enter a folder path";
        try {
          const stats = await fs.stat(input);
          if (!stats.isDirectory()) return "Path must be a directory";
          return true;
        } catch {
          return "Folder not found. Please check the path.";
        }
      },
    },
  ]);

  return folderPath;
}

async function browseFolders() {
  let currentPath = "/Users/miko";

  while (true) {
    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });
      const folders = entries
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
        .sort((a, b) => a.name.localeCompare(b.name));

      if (folders.length === 0) {
        console.log("\n⚠️  No subfolders found in this directory.");
        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
              { name: "📁 Use this folder", value: "use" },
              { name: "⬆️  Go back", value: "back" },
              { name: "❌ Cancel", value: "cancel" },
            ],
          },
        ]);

        if (action === "use") return currentPath;
        if (action === "cancel") return null;
        if (action === "back") {
          currentPath = path.dirname(currentPath);
          continue;
        }
      }

      const choices = [
        { name: `📁 Use current folder: ${currentPath}`, value: "USE_CURRENT" },
        { name: "⬆️  Go up one level", value: "GO_UP" },
        new inquirer.Separator("--- Subfolders ---"),
        ...folders.map((folder) => ({
          name: `📂 ${folder.name}`,
          value: path.join(currentPath, folder.name),
        })),
      ];

      const { selected } = await inquirer.prompt([
        {
          type: "list",
          name: "selected",
          message: `Current: ${currentPath}`,
          choices: choices,
          pageSize: 15,
        },
      ]);

      if (selected === "USE_CURRENT") {
        return currentPath;
      } else if (selected === "GO_UP") {
        currentPath = path.dirname(currentPath);
      } else {
        currentPath = selected;
      }
    } catch (error) {
      console.error("❌ Error browsing folders:", error.message);
      return null;
    }
  }
}

async function getProjectFolders(mainFolder) {
  const entries = await fs.readdir(mainFolder, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(mainFolder, entry.name));
}

async function getImages(folder) {
  const files = await fs.readdir(folder);
  return files
    .filter((file) => {
      const ext = path.extname(file).toLowerCase();
      return CONFIG.imageExtensions.includes(ext);
    })
    .map((file) => path.join(folder, file));
}

async function imageToBase64(imagePath) {
  const buffer = await fs.readFile(imagePath);
  return buffer.toString("base64");
}

async function analyzeProjectWithAI(images, folderName) {
  console.log("🤖 Analyzing images with Gemini AI...");

  try {
    // Prepare images for Gemini (use first 5 images max to save API costs)
    const imagesToAnalyze = images.slice(0, 5);
    const imageParts = await Promise.all(
      imagesToAnalyze.map(async (imagePath) => {
        const base64Data = await imageToBase64(imagePath);
        const ext = path.extname(imagePath).toLowerCase().substring(1);
        const mimeType = ext === "jpg" ? "image/jpeg" : `image/${ext}`;

        return {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        };
      })
    );

    // Create category list for AI
    const categoryList = Object.entries(CONFIG.categories)
      .map(([id, cat]) => `${id}: ${cat.en}`)
      .join(", ");

    // Create subcategory list
    const subcatList = Object.entries(CONFIG.subcategories)
      .map(([catId, subs]) => {
        const subNames = subs.map((s) => `${s.id}: ${s.en}`).join(", ");
        return `Category ${catId}: [${subNames}]`;
      })
      .join("\n");

    const prompt = `You are an expert architectural analyst. Analyze these architectural project images and provide:

1. A professional project title in 3 languages (English, Kurdish Sorani, Arabic)
2. A detailed description (2-3 sentences) in 3 languages
3. Select the most appropriate category ID from: ${categoryList}
4. If applicable, select a subcategory ID from:
${subcatList}

Folder name hint: "${folderName}"

Respond ONLY in this EXACT JSON format (no markdown, no explanation):
{
  "title_en": "English title here",
  "title_ku": "Kurdish title here (use Kurdish Sorani script)",
  "title_ar": "Arabic title here (use Arabic script)",
  "description_en": "English description here",
  "description_ku": "Kurdish description here (use Kurdish Sorani script)",
  "description_ar": "Arabic description here (use Arabic script)",
  "category_id": 7,
  "subcategory_id": 1
}

If no suitable subcategory, use: "subcategory_id": null

Make titles concise (3-6 words) and descriptions informative but brief.`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();

    // Clean up response (remove markdown code blocks if present)
    text = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    console.log("📄 AI Response:", text);

    const data = JSON.parse(text);

    // Validate category
    if (!CONFIG.categories[data.category_id]) {
      console.log("⚠️  Invalid category, defaulting to Interior Design (7)");
      data.category_id = 7;
    }

    // Validate subcategory
    if (data.subcategory_id) {
      const validSubs = CONFIG.subcategories[data.category_id];
      const isValid =
        validSubs && validSubs.some((s) => s.id === data.subcategory_id);
      if (!isValid) {
        console.log("⚠️  Invalid subcategory, setting to null");
        data.subcategory_id = null;
      }
    }

    return data;
  } catch (error) {
    console.error("❌ AI Analysis Error:", error.message);

    // Fallback data
    console.log("📝 Using fallback data based on folder name...");
    return {
      title_en: folderName,
      title_ku: folderName,
      title_ar: folderName,
      description_en: `Architectural project: ${folderName}`,
      description_ku: `پرۆژەی تەلارسازی: ${folderName}`,
      description_ar: `مشروع معماري: ${folderName}`,
      category_id: 7, // Default to Interior Design
      subcategory_id: null,
    };
  }
}

async function uploadImageToCloud(imagePath) {
  console.log(`📤 Uploading: ${path.basename(imagePath)}`);

  try {
    const form = new FormData();
    const fileStream = require("fs").createReadStream(imagePath);
    form.append("file", fileStream, path.basename(imagePath));

    const response = await fetch(
      `${CONFIG.cloudAPI.baseURL}/file/upload?allowDuplicates=true`,
      {
        method: "POST",
        headers: {
          "X-API-Key": CONFIG.cloudAPI.apiKey,
          ...form.getHeaders(),
        },
        body: form,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Upload failed: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success || !data.fileId) {
      throw new Error("Upload response missing fileId");
    }

    console.log(`✅ Uploaded: ${data.fileId}`);
    return data.fileId;
  } catch (error) {
    console.error(
      `❌ Upload error for ${path.basename(imagePath)}:`,
      error.message
    );
    return null;
  }
}

async function createProjectInDatabase(connection, projectData, imageIds) {
  console.log("💾 Creating project in database...");

  try {
    // Insert project
    const [result] = await connection.execute(
      `INSERT INTO projects (
        title_en, title_ku, title_ar,
        description_en, description_ku, description_ar,
        category_id, subcategory_id,
        date, status, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), 'completed', 1)`,
      [
        projectData.title_en,
        projectData.title_ku,
        projectData.title_ar,
        projectData.description_en,
        projectData.description_ku,
        projectData.description_ar,
        projectData.category_id,
        projectData.subcategory_id,
      ]
    );

    const projectId = result.insertId;
    console.log(`✅ Project created with ID: ${projectId}`);

    // Insert gallery images
    if (imageIds && imageIds.length > 0) {
      console.log(`📸 Adding ${imageIds.length} images to gallery...`);

      for (let i = 0; i < imageIds.length; i++) {
        const imageId = imageIds[i];
        if (imageId) {
          await connection.execute(
            `INSERT INTO galleries (project_id, image_url, is_main, sort_order)
             VALUES (?, ?, ?, ?)`,
            [projectId, imageId, i === 0 ? 1 : 0, i + 1]
          );
        }
      }

      console.log(
        `✅ Added ${imageIds.filter((id) => id).length} images to gallery`
      );
    }

    return projectId;
  } catch (error) {
    console.error("❌ Database error:", error.message);
    throw error;
  }
}

async function processProject(connection, projectFolder, folderName) {
  console.log("\n" + "=".repeat(60));
  console.log(`📁 Processing: ${folderName}`);
  console.log("=".repeat(60));

  try {
    // Get images
    const images = await getImages(projectFolder);

    if (images.length === 0) {
      console.log("⚠️  No images found, skipping...");
      return { success: false, reason: "No images" };
    }

    console.log(`📸 Found ${images.length} images`);

    // Analyze with AI
    const projectData = await analyzeProjectWithAI(images, folderName);

    console.log("\n📋 Project Data:");
    console.log(`   Title (EN): ${projectData.title_en}`);
    console.log(`   Title (KU): ${projectData.title_ku}`);
    console.log(`   Title (AR): ${projectData.title_ar}`);
    console.log(
      `   Category: ${CONFIG.categories[projectData.category_id]?.en}`
    );
    if (projectData.subcategory_id) {
      const subcat = CONFIG.subcategories[projectData.category_id]?.find(
        (s) => s.id === projectData.subcategory_id
      );
      console.log(`   Subcategory: ${subcat?.en || "Unknown"}`);
    }

    // Confirm with better UI
    const { proceed } = await inquirer.prompt([
      {
        type: "list",
        name: "proceed",
        message: "What would you like to do with this project?",
        choices: [
          { name: "✅ Upload this project", value: "yes" },
          { name: "⏭️  Skip to next project", value: "skip" },
          { name: "❌ Cancel entire upload", value: "cancel" },
        ],
      },
    ]);

    if (proceed === "skip") {
      console.log("⏭️  Skipped");
      return { success: false, reason: "Skipped by user" };
    }

    if (proceed === "cancel") {
      console.log("❌ Cancelled");
      throw new Error("Upload cancelled by user");
    }

    // Upload images
    console.log("\n📤 Uploading images to cloud storage...");
    const imageIds = await Promise.all(
      images.map((img) => uploadImageToCloud(img))
    );

    const successfulUploads = imageIds.filter((id) => id !== null);
    console.log(
      `✅ Uploaded ${successfulUploads.length}/${images.length} images`
    );

    if (successfulUploads.length === 0) {
      console.log("❌ No images uploaded successfully");
      return { success: false, reason: "Upload failed" };
    }

    // Create project in database
    const projectId = await createProjectInDatabase(
      connection,
      projectData,
      imageIds
    );

    console.log(`\n🎉 SUCCESS! Project #${projectId} created!`);
    console.log(`   Title: ${projectData.title_en}`);
    console.log(`   Images: ${successfulUploads.length}`);

    return {
      success: true,
      projectId,
      title: projectData.title_en,
      images: successfulUploads.length,
    };
  } catch (error) {
    console.error("❌ Error processing project:", error.message);
    return { success: false, reason: error.message };
  }
}

async function main() {
  console.log("🚀 AI-Powered Bulk Project Upload\n");
  console.log("=".repeat(60));

  // Get main folder with visual selection
  const mainFolder = await selectFolderWithDialog();

  if (!mainFolder) {
    console.log("❌ No folder selected");
    rl.close();
    return;
  }

  // Verify folder exists
  try {
    const stats = await fs.stat(mainFolder);
    if (!stats.isDirectory()) {
      console.log("❌ Selected path is not a directory");
      rl.close();
      return;
    }
  } catch (error) {
    console.log("❌ Folder not found:", mainFolder);
    rl.close();
    return;
  }

  // Get project folders
  console.log("\n🔍 Scanning for project folders...");
  const projectFolders = await getProjectFolders(mainFolder);

  if (projectFolders.length === 0) {
    console.log("❌ No subfolders found");
    rl.close();
    return;
  }

  console.log(`✅ Found ${projectFolders.length} project folders\n`);

  // Show folder list with interactive selection
  const folderNames = projectFolders.map((folder, i) => ({
    name: `${i + 1}. ${path.basename(folder)}`,
    value: i,
  }));

  const { selectedFolders } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFolders",
      message:
        "Select which projects to upload (use spacebar to select, enter to confirm):",
      choices: [
        { name: "📌 Select All", value: "ALL", checked: true },
        new inquirer.Separator("--- Projects ---"),
        ...folderNames,
      ],
      pageSize: 15,
      validate: (answer) => {
        if (answer.length === 0) {
          return "You must select at least one project!";
        }
        return true;
      },
    },
  ]);

  // Filter selected projects
  let selectedProjects;
  if (selectedFolders.includes("ALL")) {
    selectedProjects = projectFolders;
    console.log(`\n✅ All ${projectFolders.length} projects selected`);
  } else {
    selectedProjects = selectedFolders.map((i) => projectFolders[i]);
    console.log(`\n✅ ${selectedProjects.length} projects selected`);
  }

  // Connect to database
  console.log("\n📊 Connecting to database...");
  const connection = await mysql.createConnection(CONFIG.db);
  console.log("✅ Connected to database\n");

  // Process each selected project
  const results = {
    total: selectedProjects.length,
    success: 0,
    failed: 0,
    skipped: 0,
    projects: [],
  };

  for (let i = 0; i < selectedProjects.length; i++) {
    const folder = selectedProjects[i];
    const folderName = path.basename(folder);

    console.log(`\n[${i + 1}/${selectedProjects.length}]`);

    const result = await processProject(connection, folder, folderName);

    if (result.success) {
      results.success++;
      results.projects.push({
        id: result.projectId,
        title: result.title,
        images: result.images,
      });
    } else if (result.reason === "Skipped by user") {
      results.skipped++;
    } else {
      results.failed++;
    }

    // Small delay between projects
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Close connection
  await connection.end();
  rl.close();

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 UPLOAD SUMMARY");
  console.log("=".repeat(60));
  console.log(`Total projects: ${results.total}`);
  console.log(`✅ Successful: ${results.success}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⏭️  Skipped: ${results.skipped}`);

  if (results.projects.length > 0) {
    console.log("\n📋 Created Projects:");
    results.projects.forEach((p) => {
      console.log(`   #${p.id}: ${p.title} (${p.images} images)`);
    });
  }

  console.log("\n✨ Done!\n");
}

// Run
main().catch((error) => {
  console.error("\n❌ Fatal error:", error);
  rl.close();
  process.exit(1);
});
