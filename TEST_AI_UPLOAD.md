# ✅ AI Upload Script - Ready to Use!

## 🎉 Fixed!

The `inquirer.prompt is not a function` error is now fixed!

---

## 🚀 Quick Test

### **Step 1: Run the script**

```bash
node scripts/ai-bulk-upload-projects.js
```

### **Step 2: You'll see:**

```
🚀 AI-Powered Bulk Project Upload

============================================================

📂 Folder Selection Options:

? How would you like to select the folder? (Use arrow keys)
❯ 🖱️  Use macOS Folder Picker (Visual)
  📋 Type/Paste the path manually
  🗂️  Browse folders interactively
```

**Use arrow keys ↑↓ to choose, press Enter**

---

## 📁 Test with Sample Folder

### **Create a test folder:**

```bash
# Create test structure
mkdir -p ~/Desktop/Test-Upload/Project-1
mkdir -p ~/Desktop/Test-Upload/Project-2

# Add some test images (you can drag real images here)
# For now just create empty files to test structure
touch ~/Desktop/Test-Upload/Project-1/image1.jpg
touch ~/Desktop/Test-Upload/Project-1/image2.jpg
touch ~/Desktop/Test-Upload/Project-2/photo1.jpg
```

### **Run script:**

```bash
node scripts/ai-bulk-upload-projects.js
```

### **Select folder:**

1. Choose "🖱️ Use macOS Folder Picker"
2. Navigate to Desktop
3. Select "Test-Upload" folder
4. Click "Choose"

---

## ✅ What Should Happen

```
🚀 AI-Powered Bulk Project Upload

📂 Folder Selection Options:

? How would you like to select the folder?
❯ 🖱️  Use macOS Folder Picker (Visual)

🖱️  Opening folder picker dialog...
✅ Selected: /Users/miko/Desktop/Test-Upload

🔍 Scanning for project folders...
✅ Found 2 project folders

? Select which projects to upload:
❯ ◉ 📌 Select All
  --- Projects ---
  ◉ 1. Project-1
  ◉ 2. Project-2
```

**Then for each project:**

```
[1/2]
==============================================================
📁 Processing: Project-1
==============================================================
📸 Found 2 images
🤖 Analyzing images with Gemini AI...

📋 Project Data:
   Title (EN): ...
   Title (KU): ...
   Title (AR): ...
   Category: Interior Design

? What would you like to do with this project?
❯ ✅ Upload this project
  ⏭️  Skip to next project
  ❌ Cancel entire upload
```

---

## 🎯 Real Usage

### **When you're ready with real projects:**

1. **Organize your projects:**
   ```
   My Projects/
   ├── Villa Design/
   │   ├── living-room.jpg
   │   ├── kitchen.jpg
   │   └── bedroom.jpg
   ├── Restaurant/
   │   └── interior.jpg
   └── Office/
       └── lobby.jpg
   ```

2. **Make sure you have:**
   - ✅ Google AI Studio API key in `.env.local`
   - ✅ MySQL running
   - ✅ Cloud API configured

3. **Run script:**
   ```bash
   node scripts/ai-bulk-upload-projects.js
   ```

4. **Follow the visual prompts!**

---

## 🐛 Troubleshooting

### **Error: "inquirer.prompt is not a function"**
✅ **FIXED!** If you still see this, run:
```bash
npm install inquirer@8.2.5 --save
```

### **Error: "API_KEY not found"**
**Solution:** Add to `.env.local`:
```
API_KEY=your-google-ai-studio-key-here
```

### **Error: "Folder not found"**
**Solution:** 
- Use the visual folder picker (easiest!)
- Make sure the folder exists
- Try browsing folders interactively

### **Error: "No images found"**
**Solution:**
- Check image file extensions (`.jpg`, `.png`, etc.)
- Make sure images are in project subfolders
- Each subfolder = one project

---

## 💡 Tips

### **Best Folder Structure:**

```
✅ Good:
Main Folder/
├── Project 1/         ← One project
│   ├── img1.jpg
│   └── img2.jpg
└── Project 2/         ← Another project
    └── photo.jpg

❌ Bad:
Main Folder/
├── img1.jpg           ← Images directly in main folder
├── img2.jpg
└── photo.jpg
```

### **Best Image Names:**

```
✅ Good:
- living-room.jpg
- kitchen-view.jpg
- exterior-front.jpg

❌ Bad:
- IMG_1234.jpg
- DSC0001.jpg
- untitled.jpg
```

### **Best Folder Names:**

```
✅ Good:
- Modern Villa Design
- Restaurant Interior
- Office Building

❌ Bad:
- Project1
- New Folder
- Untitled
```

---

## 📚 Documentation

- **Quick Start:** `QUICK_START_AI_UPLOAD.md`
- **Full Guide:** `AI_BULK_UPLOAD_GUIDE.md`
- **New Interface:** `AI_UPLOAD_NEW_INTERFACE.md`
- **This Test Guide:** `TEST_AI_UPLOAD.md`

---

## ✅ Checklist

Before running for real:

- [ ] Google AI Studio API key added to `.env.local`
- [ ] MySQL is running (`brew services list`)
- [ ] Cloud API is configured
- [ ] Projects organized in folders
- [ ] Each folder contains images
- [ ] Tested with sample folder first

---

## 🚀 You're Ready!

```bash
node scripts/ai-bulk-upload-projects.js
```

**The script is working perfectly now!** 🎉

---

**Need help?** Check the other documentation files or create a test folder to practice first!
