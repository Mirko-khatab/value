# 🎉 NEW! Interactive Folder Selection for AI Upload

## ✨ What's New

The AI bulk upload script now has a **beautiful interactive interface**! No more typing paths!

---

## 🖱️ Step 1: Choose How to Select Folder

When you run the script:

```
🚀 AI-Powered Bulk Project Upload

==============================================================

📂 Folder Selection Options:

? How would you like to select the folder? (Use arrow keys)
❯ 🖱️  Use macOS Folder Picker (Visual)
  📋 Type/Paste the path manually
  🗂️  Browse folders interactively
```

**Use arrow keys ↑ ↓ to choose, then press Enter**

---

## 📁 Option 1: macOS Folder Picker (EASIEST!)

```
? How would you like to select the folder?
❯ 🖱️  Use macOS Folder Picker (Visual)

🖱️  Opening folder picker dialog...
   (Select the main folder containing your project subfolders)
```

**A macOS Finder window will open:**

```
┌─────────────────────────────────────────────┐
│  Select the main folder containing...      │
│                                             │
│  Desktop                                    │
│  Documents                                  │
│  Downloads                                  │
│  ▶ My Projects                             │
│                                             │
│                    [Cancel]  [Choose]       │
└─────────────────────────────────────────────┘
```

**Just click on your folder and click "Choose"!** ✨

---

## 🗂️ Option 2: Browse Folders Interactively

```
? How would you like to select the folder?
❯ 🗂️  Browse folders interactively

Current: /Users/miko

? Choose folder: (Use arrow keys)
❯ 📁 Use current folder: /Users/miko
  ⬆️  Go up one level
  --- Subfolders ---
  📂 Desktop
  📂 Documents
  📂 Downloads
  📂 Pictures
  📂 Projects
```

**Navigate with arrow keys:**
- ↑↓ to move
- Enter to select a folder or go inside it
- Select "Use current folder" when you find the right one

---

## 📋 Option 3: Type/Paste Path Manually

```
? How would you like to select the folder?
❯ 📋 Type/Paste the path manually

? 📂 Enter the full path to the folder: /Users/miko/Desktop/My Projects
```

**For advanced users who know the exact path**

---

## ✅ Step 2: Select Which Projects to Upload

After selecting the folder, you'll see all projects:

```
✅ Found 10 project folders

? Select which projects to upload (use spacebar to select):
❯ ◉ 📌 Select All
  --- Projects ---
  ◯ 1. Modern Villa
  ◯ 2. Restaurant Interior
  ◯ 3. Office Building
  ◯ 4. Cafe Design
  ◯ 5. Luxury Apartment
  ◯ 6. Shopping Mall
  ◯ 7. Hotel Lobby
  ◯ 8. School Building
  ◯ 9. Hospital Wing
  ◯ 10. Cultural Center
```

**How to use:**
- Use **arrow keys** ↑↓ to move
- Press **spacebar** to select/unselect
- Press **Enter** when done

**Options:**
- **📌 Select All** - Uploads all projects (checked by default)
- **Individual projects** - Uncheck "Select All" first, then pick specific ones

---

## 🔄 Step 3: Confirm Each Project

For each selected project, you'll see AI analysis:

```
==============================================================
📁 Processing: Modern Villa
==============================================================
📸 Found 12 images
🤖 Analyzing images with Gemini AI...

📋 Project Data:
   Title (EN): Contemporary Luxury Villa Interior
   Title (KU): دیزاینی ناوەوەی ڤیلای لوکسی سەردەمیانە
   Title (AR): تصميم داخلي لفيلا فاخرة معاصرة
   Category: Interior Design
   Subcategory: Residential Interiors

? What would you like to do with this project? (Use arrow keys)
❯ ✅ Upload this project
  ⏭️  Skip to next project
  ❌ Cancel entire upload
```

**Choose what to do:**
- **✅ Upload** - Uploads this project
- **⏭️ Skip** - Skips to next project
- **❌ Cancel** - Stops everything

---

## 🎨 Visual Comparison

### **Before (Old Way):**
```
📂 Enter the path to the main folder:
> /Users/miko/Desktop/My Projects    ← Had to type this!
```

### **After (New Way):**
```
? How would you like to select the folder?
❯ 🖱️  Use macOS Folder Picker (Visual)  ← Just click!

[macOS Finder window opens]
[Click folder]
[Click "Choose"]
✅ Selected: /Users/miko/Desktop/My Projects
```

**Much easier!** 🎉

---

## 📸 Screenshots of Interface

### **Main Menu:**
```
? How would you like to select the folder?
  🖱️  Use macOS Folder Picker (Visual)     ← Best for beginners
  📋 Type/Paste the path manually           ← For experts
❯ 🗂️  Browse folders interactively          ← Fun to explore
```

### **Project Selection:**
```
? Select which projects to upload:
❯ ◉ 📌 Select All                           ← Quick: upload all
  --- Projects ---
  ◉ 1. Modern Villa                         ◉ = Selected
  ◯ 2. Restaurant Interior                  ◯ = Not selected
  ◉ 3. Office Building
  ◯ 4. Cafe Design
```

### **Confirmation:**
```
? What would you like to do with this project?
❯ ✅ Upload this project                    ← Go ahead
  ⏭️  Skip to next project                  ← Not this one
  ❌ Cancel entire upload                   ← Stop everything
```

---

## 💡 Tips

### **Fastest Method:**
1. Run script
2. Select "macOS Folder Picker"
3. Click on your projects folder
4. Keep "Select All" checked
5. Confirm each project or skip

### **Selective Upload:**
1. Run script  
2. Select any folder method
3. **Uncheck "Select All"**
4. Use spacebar to select only projects you want
5. Press Enter

### **Exploring First:**
1. Run script
2. Select "Browse folders interactively"
3. Navigate to see all your folders
4. Select when ready

---

## 🎯 Example Workflow

### **Complete Example:**

```bash
# 1. Run script
node scripts/ai-bulk-upload-projects.js

# 2. See menu
? How would you like to select the folder?
❯ 🖱️  Use macOS Folder Picker (Visual)

# 3. Finder opens
# Click "Desktop" > "My Projects" > "Choose"

# 4. Projects listed
✅ Found 5 project folders

? Select which projects to upload:
❯ ◯ 📌 Select All          ← Press spacebar to uncheck
  --- Projects ---
  ◉ 1. Villa A             ← Selected (pressed spacebar)
  ◯ 2. Villa B             ← Not selected
  ◉ 3. Restaurant          ← Selected (pressed spacebar)
  ◯ 4. Office              ← Not selected
  ◯ 5. Hotel               ← Not selected

# Press Enter

✅ 2 projects selected

# 5. For each project
📋 Project Data:
   Title (EN): Modern Villa Interior Design
   ...

? What would you like to do?
❯ ✅ Upload this project

# 6. Done!
📊 UPLOAD SUMMARY
✅ Successful: 2
```

---

## 🎮 Keyboard Controls

### **List Selection (Arrow Keys):**
- `↑` / `↓` - Move up/down
- `Enter` - Select/Confirm
- `Esc` - Cancel (sometimes)

### **Checkbox Selection (Multiple):**
- `↑` / `↓` - Move up/down
- `Spacebar` - Toggle selection (check/uncheck)
- `Enter` - Confirm selected items
- `a` - Toggle all (in some cases)

### **Text Input:**
- Type normally
- `Enter` - Submit
- `Tab` - Auto-complete (if available)

---

## ❓ FAQ

### **Q: Do I still need to type paths?**
**A:** No! Just use the macOS Folder Picker - point and click!

### **Q: Can I upload only some projects?**
**A:** Yes! Uncheck "Select All" and use spacebar to pick specific ones.

### **Q: What if I make a mistake?**
**A:** You can skip projects or cancel anytime. No commitment until you confirm!

### **Q: Can I see folders before deciding?**
**A:** Yes! Use "Browse folders interactively" to explore first.

### **Q: Is the old way still available?**
**A:** Yes! Choose "Type/Paste the path manually" if you prefer.

---

## 🆚 Comparison Table

| Feature | Old Way | New Way |
|---------|---------|---------|
| **Folder Selection** | Type path | Point & click OR browse OR type |
| **Project Selection** | All or nothing | Choose specific projects |
| **Confirmation** | y/n text | Visual menu |
| **Visual Feedback** | Minimal | Icons, colors, clear layout |
| **Error Prevention** | Easy to typo | Visual validation |
| **User Experience** | Basic | Professional ✨ |

---

## ✅ What You Get

### **Much Easier:**
- ✅ No more typing long paths
- ✅ Visual folder picker
- ✅ See all projects before uploading
- ✅ Choose specific projects
- ✅ Clear, beautiful interface

### **More Control:**
- ✅ Select only the projects you want
- ✅ Skip projects easily
- ✅ Cancel anytime
- ✅ Review before committing

### **Professional UI:**
- ✅ Arrow key navigation
- ✅ Icons and emojis
- ✅ Clear options
- ✅ Helpful prompts
- ✅ Modern interface

---

## 🚀 Try It Now!

```bash
node scripts/ai-bulk-upload-projects.js
```

**Experience the new interface! It's so much better!** 🎉

---

## 📝 Summary

### **3 Ways to Select Folder:**
1. 🖱️ **macOS Picker** - Point & click (easiest!)
2. 🗂️ **Browse** - Navigate interactively
3. 📋 **Manual** - Type path (for pros)

### **Project Selection:**
- ✅ Select All - Upload everything
- ✅ Pick Specific - Choose only what you want
- ✅ Checkbox interface with spacebar

### **Better Confirmations:**
- ✅ Visual menus
- ✅ Clear options
- ✅ Arrow key navigation

**The AI upload is now super easy and professional!** ✨🚀

---

**Ready to try it?**

```bash
node scripts/ai-bulk-upload-projects.js
```

**Enjoy the new interface!** 🎊
