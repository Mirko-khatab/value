# Quick Guide: How to Add New Locations

## 🚀 Three Ways to Add Locations

### Method 1: From Project Form (Easiest)

**Perfect for when you're creating a project and need a new location**

1. Open **Dashboard → Projects → Create Project**
2. Scroll to the **Location** field
3. Click the dropdown
4. Type to search for your location
5. If not found, click **"Add New Location"** button
6. Fill in the form in the new tab:
   - Select Country
   - Enter City in Kurdish (e.g., هەولێر)
   - Enter City in Arabic (e.g., أربيل)
   - Enter City in English (e.g., Erbil)
7. Click **"Create Location"**
8. Return to your project and refresh

### Method 2: From Locations Dashboard

**Best for adding multiple locations at once**

1. Go to **Dashboard → Locations**
2. Click **"Add Location"** (blue button, top-right)
3. Fill in the form:
   - Select **Country** from dropdown
   - Enter **City (Kurdish)**
   - Enter **City (Arabic)**
   - Enter **City (English)**
4. Click **"Create Location"**
5. Done! Location is immediately available

### Method 3: Direct SQL (Advanced)

**For bulk imports or if you're comfortable with SQL**

```sql
-- Add a single location (Iraq has country_id = 1)
INSERT INTO locations (country_id, city_ku, city_ar, city_en)
VALUES (1, 'ئامێدی', 'العمادية', 'Amedi');

-- Add multiple locations at once
INSERT INTO locations (country_id, city_ku, city_ar, city_en) VALUES
(1, 'کۆیە', 'كويسنجق', 'Koya'),
(1, 'سۆران', 'سوران', 'Soran'),
(1, 'ڕەواندوز', 'راوندوز', 'Rawanduz');
```

## 🌍 Adding a New Country

### Via Dashboard (Coming Soon)

Dashboard for countries is planned for a future update.

### Via SQL

```sql
-- Add a new country
INSERT INTO countries (name_ku, name_ar, name_en, code)
VALUES ('تورکیا', 'تركيا', 'Turkey', 'TUR');

-- Then add cities for that country (assuming new country got ID 2)
INSERT INTO locations (country_id, city_ku, city_ar, city_en) VALUES
(2, 'ئەنقەرە', 'أنقرة', 'Ankara'),
(2, 'ئیستانبوول', 'إسطنبول', 'Istanbul');
```

## 🔍 Search Features

The location selector is smart! You can search by:

- English name: "Erbil"
- Kurdish name: "هەولێر"
- Arabic name: "أربيل"
- Country: "Iraq"
- Partial matches: "Sulay" finds "Sulaymaniyah"

## ✅ Tips for Best Results

1. **Search first** - Your location might already exist
2. **Use correct spellings** - Follow existing patterns in the database
3. **Fill all three languages** - This helps with search and consistency
4. **Test it** - Create a test project to verify the new location works

## 📊 Current Locations

The database currently includes:

- **8 Countries**: Iraq, Turkey, Iran, Syria, USA, UK, Germany, France
- **43 Iraqi Cities**: Covering all 19 governorates

## ❌ Common Mistakes

1. **Leaving languages empty** - Fill all three! (Kurdish, Arabic, English)
2. **Adding duplicates** - Search first to avoid duplicates
3. **Typos in names** - Double-check spelling
4. **Wrong country** - Make sure you select the correct country

## 🆘 Troubleshooting

**Q: I added a location but can't find it**

- Refresh the page
- Check if it was created successfully in Dashboard → Locations

**Q: I can't delete a location**

- The location is being used in projects
- Update those projects first, then delete

**Q: The dropdown is too slow**

- This is normal for 40+ items
- Use the search feature instead of scrolling

---

**Need more help?** Check out `LOCATION_MANAGEMENT_GUIDE.md` for the complete documentation.



