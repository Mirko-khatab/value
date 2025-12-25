# 🤖 AI-Powered Bulk Project Upload Guide

## ✨ Overview

This script uses **Google Gemini AI** to automatically analyze your project images and:
- ✅ Generate professional titles in 3 languages (English, Kurdish, Arabic)
- ✅ Write detailed descriptions in 3 languages  
- ✅ Automatically select the best category based on images
- ✅ Automatically select subcategory if applicable
- ✅ Upload all images to cloud storage
- ✅ Create projects in your database

**Perfect for bulk uploading multiple projects at once!**

---

## 📋 Prerequisites

### 1. **Google AI Studio API Key**

You need a Google AI Studio (Gemini) API key:

1. Go to: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key

### 2. **Add API Key to .env.local**

```bash
# Open your .env.local file
nano .env.local

# Add this line:
API_KEY=your-google-ai-studio-key-here

# Save and exit
```

### 3. **Folder Structure**

Organize your projects like this:

```
My Projects/
├── Villa Project 1/
│   ├── image1.jpg
│   ├── image2.jpg
│   ├── image3.png
│   └── image4.jpg
├── Restaurant Design/
│   ├── photo1.jpg
│   ├── photo2.jpg
│   └── photo3.jpg
├── Office Building/
│   ├── exterior1.jpg
│   ├── interior1.jpg
│   └── detail1.jpg
└── ...
```

**Requirements:**
- Main folder contains subfolders
- Each subfolder = one project
- Each project folder contains image files
- Supported formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

---

## 🚀 How to Use

### **Step 1: Run the Script**

```bash
node scripts/ai-bulk-upload-projects.js
```

### **Step 2: Enter Main Folder Path**

```
📂 Enter the path to the main folder containing project folders:
> /Users/miko/Desktop/My Projects
```

**Tips:**
- Use absolute path (full path from root)
- Or drag & drop folder into terminal
- Press Enter

### **Step 3: Review Found Projects**

```
🔍 Scanning for project folders...
✅ Found 15 project folders

   1. Villa Project 1
   2. Restaurant Design
   3. Office Building
   ...
   15. Shopping Mall

❓ Process all 15 projects? (y/n):
```

Type `y` and press Enter to proceed.

### **Step 4: Review Each Project**

For each project, the AI will:

```
==============================================================
📁 Processing: Villa Project 1
==============================================================
📸 Found 12 images
🤖 Analyzing images with Gemini AI...

📋 Project Data:
   Title (EN): Modern Luxury Villa Design
   Title (KU): دیزاینی ڤیلای مۆدێرنی لوکس
   Title (AR): تصميم فيلا فاخرة حديثة
   Category: Interior Design
   Subcategory: Residential Interiors

❓ Proceed with this data? (y/n/s for skip):
```

**Options:**
- `y` = Yes, upload this project
- `n` = No, cancel this project
- `s` = Skip this project (move to next)

### **Step 5: Wait for Upload**

```
📤 Uploading images to cloud storage...
📤 Uploading: image1.jpg
✅ Uploaded: abc123def456
📤 Uploading: image2.jpg
✅ Uploaded: ghi789jkl012
...
✅ Uploaded 12/12 images

💾 Creating project in database...
✅ Project created with ID: 45
📸 Adding 12 images to gallery...
✅ Added 12 images to gallery

🎉 SUCCESS! Project #45 created!
   Title: Modern Luxury Villa Design
   Images: 12
```

### **Step 6: Review Summary**

After all projects:

```
==============================================================
📊 UPLOAD SUMMARY
==============================================================
Total projects: 15
✅ Successful: 12
❌ Failed: 1
⏭️  Skipped: 2

📋 Created Projects:
   #45: Modern Luxury Villa Design (12 images)
   #46: Contemporary Restaurant Interior (8 images)
   #47: Corporate Office Building (15 images)
   ...

✨ Done!
```

---

## 🎯 How AI Analyzes Your Projects

### **What Gemini AI Looks At:**

1. **Image Content:**
   - Architecture style (modern, traditional, contemporary)
   - Space type (interior, exterior, landscape)
   - Purpose (residential, commercial, cultural)
   - Details (furniture, materials, lighting)

2. **Folder Name:**
   - Uses as hint for project name
   - Example: "Villa Project 2024" → Identifies as villa

3. **Multiple Images:**
   - Analyzes up to 5 images per project
   - Gets comprehensive understanding
   - Identifies main category and subcategory

### **What AI Generates:**

**Titles** (3 languages):
- English: Professional, concise (3-6 words)
- Kurdish: Proper Kurdish Sorani script
- Arabic: Proper Arabic script

**Descriptions** (3 languages):
- 2-3 sentences
- Professional architectural language
- Highlights key features
- Mentions materials/style

**Category Selection:**
- Analyzes image content
- Selects from 6 main categories:
  - Residential Complex
  - Landscape Design
  - Exterior Design
  - Interior Design ⭐ (most common)
  - Urban Design & Siteplanning
  - Proposal

**Subcategory Selection:**
- If Interior Design: Selects from 9 subcategories
  - Residential Interiors
  - Health Care Interiors
  - Restaurant and Cafe
  - Retail / Shop / Outlet
  - Industrial
  - Hotel
  - Educational
  - Cultural / Public
  - Wellness and Entertainment

- If Exterior Design: Selects from 5 subcategories
  - Residential
  - Commercial
  - Retrofit Facade
  - Cultural / Public
  - Health Care Exteriors

---

## 📂 Example Workflow

### **Input Folder:**
```
/Users/miko/Desktop/Projects to Upload/
├── Modern Villa Erbil/
│   ├── living-room.jpg
│   ├── kitchen.jpg
│   ├── bedroom.jpg
│   └── facade.jpg
├── Coffee Shop Downtown/
│   ├── interior1.jpg
│   ├── bar.jpg
│   └── seating.jpg
└── Office Complex/
    ├── lobby.jpg
    └── meeting-room.jpg
```

### **AI Analysis Results:**

**Project 1: Modern Villa Erbil**
```json
{
  "title_en": "Contemporary Villa Interior Design",
  "title_ku": "دیزاینی ناوەوەی ڤیلای سەردەمیانە",
  "title_ar": "تصميم داخلي لفيلا عصرية",
  "description_en": "A modern villa interior featuring open-plan living spaces with premium finishes. The design combines contemporary aesthetics with comfortable residential functionality.",
  "description_ku": "دیزاینی ناوەوەی ڤیلای مۆدێرن کە ناوچەی ژیانی کراوەی تێدایە لەگەڵ تەواوکاری پلەی یەکەم. دیزاینەکە جوانی سەردەمیانە تێکەڵ دەکات لەگەڵ کارایی نیشتەجێبوونی ئاسوودە.",
  "description_ar": "تصميم داخلي عصري لفيلا يتميز بمساحات معيشية مفتوحة مع تشطيبات فاخرة. يجمع التصميم بين الجماليات المعاصرة والوظائف السكنية المريحة.",
  "category_id": 7,
  "subcategory_id": 1
}
```

**Project 2: Coffee Shop Downtown**
```json
{
  "title_en": "Modern Cafe Interior Design",
  "title_ku": "دیزاینی ناوەوەی کافێی مۆدێرن",
  "title_ar": "تصميم داخلي لمقهى عصري",
  "description_en": "A contemporary coffee shop design featuring warm ambiance and functional layout. The space incorporates modern furniture and creative lighting solutions.",
  "description_ku": "دیزاینی کافێیەکی سەردەمیانە کە کەشێکی گەرم و ڕێکخستنێکی کارای تێدایە. ناوچەکە مۆبیلیای مۆدێرن و چارەسەری ڕووناکیی داهێنەرانە لەخۆ دەگرێت.",
  "description_ar": "تصميم مقهى معاصر يتميز بأجواء دافئة وتخطيط وظيفي. يتضمن المساحة أثاثاً عصرياً وحلول إضاءة إبداعية.",
  "category_id": 7,
  "subcategory_id": 4
}
```

---

## ⚙️ Advanced Configuration

### **Modify Categories:**

Edit `scripts/ai-bulk-upload-projects.js` line 33-40:

```javascript
categories: {
  4: { en: 'Residential Complex', ku: '...', ar: '...' },
  5: { en: 'Landscape Design', ku: '...', ar: '...' },
  // Add your custom categories here
}
```

### **Change AI Model:**

Line 100:

```javascript
model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
// Options: 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro-vision'
```

### **Adjust Images Analyzed:**

Line 185:

```javascript
const imagesToAnalyze = images.slice(0, 5); // Change 5 to your preference
// More images = better analysis but slower & more expensive
```

### **Change Default Category:**

Line 272 (fallback):

```javascript
category_id: 7, // Change to your preferred default
```

---

## 🐛 Troubleshooting

### **Error: API_KEY not found**

```bash
❌ Error: GEMINI API_KEY not found in .env file!
```

**Solution:**
1. Check your `.env.local` file exists
2. Make sure it contains: `API_KEY=your-key-here`
3. No spaces around `=`
4. No quotes around the key

### **Error: Folder not found**

```bash
❌ Folder not found: /path/to/folder
```

**Solution:**
- Use absolute path (starts with `/`)
- Check for typos
- Drag & drop folder to get correct path
- Make sure folder exists

### **Error: No images found**

```bash
⚠️  No images found, skipping...
```

**Solution:**
- Check image file extensions (`.jpg`, `.jpeg`, `.png`, etc.)
- Make sure images are directly in project folder (not in subfolders)
- Check file permissions

### **Error: Upload failed**

```bash
❌ Upload error: 401 Unauthorized
```

**Solution:**
- Check `CLOUD_API_KEY` in `.env.local`
- Make sure cloud API is running
- Test cloud API manually first

### **Error: Database connection failed**

```bash
❌ Error connecting to database
```

**Solution:**
```bash
# Check MySQL is running:
brew services list

# Start MySQL if needed:
brew services start mysql

# Test connection:
mysql -u root -padmin123 dashboard
```

### **AI gives wrong category**

**Solution:**
1. When prompted, type `n` to cancel
2. Manually edit the data in database later
3. Or rename project folder to be more descriptive
4. Run again with better folder names

---

## 💡 Tips for Best Results

### **1. Folder Naming:**
```
✅ Good:
   - "Modern Luxury Villa"
   - "Restaurant Interior Design"
   - "Office Building Exterior"

❌ Bad:
   - "Project1"
   - "IMG_2024"
   - "Untitled Folder"
```

### **2. Image Quality:**
- Use high-resolution images
- Include different angles
- Show key features clearly
- First image should be the best (becomes main)

### **3. Image Count:**
- Minimum: 3-5 images
- Optimal: 8-15 images
- Maximum: No limit (all will be uploaded)

### **4. Organization:**
- One folder = One project
- Don't mix projects in same folder
- Remove test/draft images first

### **5. Review Before Confirming:**
- Check titles make sense
- Check category is appropriate
- Check descriptions are accurate
- Type `s` to skip bad results

---

## 📊 Cost Estimation

### **Google Gemini AI Pricing:**

| Model | Price | Usage |
|-------|-------|-------|
| Gemini 1.5 Flash | FREE | Up to 15 requests/minute |
| Gemini 1.5 Pro | $3.50 / 1M tokens | Slower but free tier available |

**Estimated Cost:**
- Small project (5 images): ~$0.01
- Medium project (15 images): ~$0.03
- Large project (30 images): ~$0.05

**100 projects ≈ $2-5 total**

**Free tier includes:**
- 1,500 requests per day
- 1 million tokens per day
- More than enough for typical usage!

---

## 🚀 Quick Start Example

```bash
# 1. Make sure MySQL is running
brew services start mysql

# 2. Run the script
node scripts/ai-bulk-upload-projects.js

# 3. Enter your folder path
📂 Enter the path to the main folder containing project folders:
> /Users/miko/Desktop/Projects to Upload

# 4. Confirm
✅ Found 10 project folders
❓ Process all 10 projects? (y/n): y

# 5. For each project, review and confirm
📋 Project Data:
   Title (EN): Modern Villa Interior
   ...
❓ Proceed with this data? (y/n/s for skip): y

# 6. Wait for completion
🎉 SUCCESS! Project #45 created!

# 7. Check summary
📊 UPLOAD SUMMARY
✅ Successful: 10
```

---

## ✅ Checklist Before Running

- [ ] Google AI Studio API key added to `.env.local`
- [ ] Cloud API key added to `.env.local`  
- [ ] MySQL database is running
- [ ] Projects organized in folders
- [ ] Each folder contains images
- [ ] Image files are supported formats
- [ ] Folder names are descriptive
- [ ] You have reviewed the script

---

## 📚 Related Documentation

- `TECH_COMING_SOON_GUIDE.md` - Coming soon page guide
- `CLOUD_STORAGE_GUIDE.md` - Cloud storage setup
- `LOCAL_DEVELOPMENT_GUIDE.md` - Local dev setup

---

## 🎉 Success!

After running the script, your projects will be:
- ✅ Visible in dashboard at `/dashboard/projects`
- ✅ Visible on website at `/projects`
- ✅ Searchable and filterable
- ✅ Complete with multilingual content
- ✅ Professional titles and descriptions
- ✅ Correctly categorized

**Enjoy your AI-powered bulk upload! 🚀**

---

**Questions? Issues?**
- Check troubleshooting section above
- Review error messages carefully
- Test with 1-2 projects first before bulk upload
