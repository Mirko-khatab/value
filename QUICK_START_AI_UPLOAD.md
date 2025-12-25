# 🚀 Quick Start: AI Bulk Upload

## 📝 Step 1: Get Your Google AI Studio API Key

1. Go to: **https://makersuite.google.com/app/apikey**
2. Click **"Create API Key"**
3. Copy the API key

## ⚙️ Step 2: Add API Key to .env.local

```bash
# Edit your .env.local file:
nano .env.local

# Add this line at the bottom:
API_KEY=your-google-ai-studio-key-here

# Save: Ctrl+O, Enter, Ctrl+X
```

## 📁 Step 3: Organize Your Projects

Create a main folder with subfolders:

```
My Projects/
├── Villa Project 1/
│   ├── image1.jpg
│   ├── image2.jpg
│   └── image3.jpg
├── Restaurant Design/
│   ├── photo1.jpg
│   └── photo2.jpg
└── Office Building/
    ├── img1.jpg
    └── img2.jpg
```

**Rules:**
- Each subfolder = one project
- Put images directly in project folders
- Use `.jpg`, `.png`, `.webp`, or `.gif` files

## ▶️ Step 4: Run the Script

```bash
node scripts/ai-bulk-upload-projects.js
```

## 💬 Step 5: Follow the Prompts

### **Enter folder path:**
```
📂 Enter the path to the main folder containing project folders:
> /Users/miko/Desktop/My Projects
```

**Tip:** Drag & drop the folder into terminal to get the path!

### **Confirm projects:**
```
✅ Found 15 project folders
❓ Process all 15 projects? (y/n): y
```

### **Review each project:**
```
📋 Project Data:
   Title (EN): Modern Luxury Villa Design
   Title (KU): دیزاینی ڤیلای مۆدێرنی لوکس
   Title (AR): تصميم فيلا فاخرة حديثة
   Category: Interior Design
   Subcategory: Residential Interiors

❓ Proceed with this data? (y/n/s for skip): y
```

**Options:**
- `y` = Yes, upload
- `n` = No, cancel
- `s` = Skip to next project

## ✅ Done!

The script will:
1. ✅ Analyze images with AI
2. ✅ Generate titles in 3 languages
3. ✅ Write descriptions in 3 languages  
4. ✅ Select category automatically
5. ✅ Upload images to cloud
6. ✅ Create project in database

---

## 📊 What You'll See

### **Processing:**
```
📸 Found 12 images
🤖 Analyzing images with Gemini AI...
📤 Uploading images to cloud storage...
✅ Uploaded 12/12 images
💾 Creating project in database...
🎉 SUCCESS! Project #45 created!
```

### **Summary:**
```
📊 UPLOAD SUMMARY
Total projects: 15
✅ Successful: 12
❌ Failed: 1
⏭️  Skipped: 2
```

---

## 🐛 Common Issues

### **"API_KEY not found"**
→ Make sure you added `API_KEY=...` to `.env.local`

### **"Folder not found"**
→ Use full path (drag & drop folder to terminal)

### **"No images found"**
→ Check image file extensions (`.jpg`, `.png`, etc.)

### **"Database connection failed"**
→ Start MySQL: `brew services start mysql`

---

## 💡 Tips

- **Folder names matter:** Use descriptive names like "Modern Villa" instead of "Project1"
- **Start small:** Test with 2-3 projects first
- **Review AI results:** You can skip (`s`) or cancel (`n`) if AI gets it wrong
- **Free tier:** Google AI Studio gives you 1,500 requests/day for FREE!

---

## 📚 Full Documentation

See `AI_BULK_UPLOAD_GUIDE.md` for complete details.

---

**Ready? Let's upload!** 🚀

```bash
node scripts/ai-bulk-upload-projects.js
```
