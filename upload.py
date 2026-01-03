#!/usr/bin/env python3
"""
AI-Powered Bulk Project Upload Script (Python) - FULLY AUTOMATIC

Uses Google Gemini AI to analyze project images and automatically:
- Generate titles (English, Kurdish, Arabic)
- Generate descriptions (English, Kurdish, Arabic)
- Select appropriate category and subcategory
- Upload images to cloud storage
- Create projects in database

Usage:
    python3 upload.py
    
    1. Select folder containing project subfolders (GUI)
    2. Select Excel file with location data (GUI, optional)
    3. Script automatically uploads ALL projects without asking!

No more prompts! Just select folder and Excel file, then sit back and watch!
"""

import os
import sys
import json
import base64
import warnings

# Suppress warnings for cleaner output
warnings.filterwarnings('ignore', category=FutureWarning)
warnings.filterwarnings('ignore', category=DeprecationWarning)
warnings.filterwarnings('ignore', message='urllib3 v2 only supports OpenSSL')
warnings.filterwarnings('ignore', message='An error occurred.*importlib')

# Check Python version
if sys.version_info < (3, 8):
    print("❌ Error: Python 3.8 or higher is required")
    print(f"   Your version: {sys.version}")
    sys.exit(1)

try:
    import mysql.connector
except ImportError:
    print("❌ Error: mysql-connector-python is not installed")
    print("   Install it with: pip3 install mysql-connector-python")
    sys.exit(1)

try:
    import requests
except ImportError:
    print("❌ Error: requests is not installed")
    print("   Install it with: pip3 install requests")
    sys.exit(1)

try:
    from pathlib import Path
except ImportError:
    print("❌ Error: pathlib is not available (should be built-in)")
    sys.exit(1)

try:
    import google.generativeai as genai
except ImportError as e:
    print("❌ Error: google-generativeai is not installed")
    print("   Install it with: pip3 install google-generativeai")
    print(f"   Details: {e}")
    sys.exit(1)
except Exception as e:
    print(f"⚠️  Warning: Issue loading google-generativeai: {e}")
    print("   Attempting to continue...\n")

try:
    import subprocess
    from datetime import datetime
    import time
except ImportError as e:
    print(f"❌ Error: Missing standard library: {e}")
    sys.exit(1)

try:
    import pandas as pd
except ImportError:
    print("❌ Error: pandas is not installed")
    print("   Install it with: pip3 install pandas openpyxl")
    sys.exit(1)

try:
    from PIL import Image as PILImage
except ImportError:
    print("❌ Error: Pillow is not installed")
    print("   Install it with: pip3 install Pillow")
    sys.exit(1)

# Configuration
CONFIG = {
    # Database
    "db": {
        "host": "localhost",
        "user": "root",
        "password": "admin123",
        "database": "dashboard",
    },
    
    # Cloud Storage API
    "cloud": {
        "base_url": "https://api.mirkokawa.dev/api",
        "api_key": "csk_74b635fbff903577a8e977da9a68456e1466bf0aeabb5160e977aec317703c60",
    },
    
    # Google Gemini AI
    "gemini_api_key": "AIzaSyCqbDabQwPvabz-IBOujmqn6VCo82vwKkg",
    
    # Supported image formats
    "image_extensions": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
    
    # Categories (from database)
    "categories": {
        4: {"en": "Residential Complex", "ku": "کۆمەڵگەی نیشتەجێبوون", "ar": "مجمع سكني"},
        5: {"en": "Landscape Design", "ku": "دیزاینی باخچە", "ar": "تصميم المناظر الطبيعية"},
        6: {"en": "Exterior Design", "ku": "دیزاینی دەرەوە", "ar": "تصميم خارجي"},
        7: {"en": "Interior Design", "ku": "دیزاینی ناوەوە", "ar": "تصميم داخلي"},
        8: {"en": "Urban Design & Siteplanning", "ku": "دیزاینی شار و پلاندانانی شوێن", "ar": "التصميم الحضري وتخطيط الموقع"},
        10: {"en": "Proposal", "ku": "پێشنیاز", "ar": "اقتراح"},
    },
    
    # Locations (from database) - map location names to IDs
    # Add your location mappings here (name -> ID)
    # Names are case-insensitive
    "locations": {
        "sulaymaniyah": 11,
        "sulaimanya": 11,
        "sulemani": 11,
        "erbil": 1,
        "hawler": 1,
        "duhok": 2,
        "duhok": 2,
        "baghdad": 3,
        # Add more location mappings as needed:
        # "your-city-name": location_id,
    },
    
    # Default location ID if not found in Excel or not mapped
    "default_location_id": 11,  # Sulaymaniyah
    
    # Subcategories
    "subcategories": {
        7: [  # Interior Design
            {"id": 1, "en": "Residential Interiors", "ku": "دیزاینی ناوخۆی نیشتەجێبوون", "ar": "تصميمات داخلية سكنية"},
            {"id": 3, "en": "Health Care Interiors", "ku": "دیزاینی ناوخۆی چاودێری تەندروستی", "ar": "تصميمات داخلية للرعاية الصحية"},
            {"id": 4, "en": "Restaurant and Cafe", "ku": "ڕێستورانت و کافێ", "ar": "مطعم ومقهى"},
            {"id": 5, "en": "Retail / Shop / Outlet", "ku": "فرۆشگا / دوکان / مەخزەن", "ar": "محل بيع بالتجزئة / دكان / منفذ بيع"},
            {"id": 6, "en": "Industrial", "ku": "پیشەسازی", "ar": "صناعي"},
            {"id": 7, "en": "Hotel", "ku": "هۆتێل", "ar": "فندق"},
            {"id": 8, "en": "Educational", "ku": "پەروەردەیی", "ar": "تعليمي"},
            {"id": 9, "en": "Cultural / Public", "ku": "کلتوری / گشتی", "ar": "ثقافي / عام"},
            {"id": 10, "en": "Wellness and Entertainment", "ku": "تەندروستی و کات بەسەربردن", "ar": "العافية والترفيه"},
        ],
        6: [  # Exterior Design
            {"id": 11, "en": "Residential", "ku": "نیشتەجێبوون", "ar": "سكني"},
            {"id": 12, "en": "Commercial", "ku": "بازرگانی", "ar": "تجاري"},
            {"id": 13, "en": "Retrofit Facade", "ku": "نوێکردنەوەی ڕووکار", "ar": "تعديل الواجهة"},
            {"id": 14, "en": "Cultural / Public", "ku": "کلتوری / گشتی", "ar": "ثقافي / عام"},
            {"id": 15, "en": "Health Care Exteriors", "ku": "دەرەوەی چاودێری تەندروستی", "ar": "واجهات الرعاية الصحية"},
        ],
    },
}

# Initialize Gemini AI (will be done in main function after displaying banner)
model = None

def initialize_gemini():
    """Initialize Gemini AI with error handling"""
    global model
    try:
        genai.configure(api_key=CONFIG["gemini_api_key"])
        # Use the same model as image_keyword_generator.py
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        print("✅ Gemini AI initialized successfully\n")
        return True
    except Exception as e:
        print(f"❌ Error initializing Gemini AI: {e}")
        print("   Please check your API key and internet connection")
        return False


def select_folder_gui():
    """Open a native macOS folder picker dialog"""
    print("\n📁 Opening folder browser...")
    print("   Please select the main folder containing your project subfolders\n")
    
    try:
        script = '''
        tell application "System Events"
            activate
            set folderPath to choose folder with prompt "Select the main folder containing project subfolders:"
            return POSIX path of folderPath
        end tell
        '''
        
        result = subprocess.run(
            ['osascript', '-e', script],
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if result.returncode == 0:
            folder_path = result.stdout.strip()
            return folder_path if folder_path else None
        else:
            return None
            
    except Exception as e:
        print(f"Error opening folder picker: {e}")
        return None


def select_excel_file_gui():
    """Open a native macOS file picker dialog for Excel file"""
    print("\n📊 Opening file browser...")
    print("   Please select the Excel file containing project locations and codes\n")
    
    try:
        script = '''
        tell application "System Events"
            activate
            set filePath to choose file with prompt "Select Excel file with project data:" of type {"com.microsoft.excel.xls", "org.openxmlformats.spreadsheetml.sheet", "public.comma-separated-values-text"}
            return POSIX path of filePath
        end tell
        '''
        
        result = subprocess.run(
            ['osascript', '-e', script],
            capture_output=True,
            text=True,
            timeout=300
        )
        
        if result.returncode == 0:
            file_path = result.stdout.strip()
            return file_path if file_path else None
        else:
            return None
            
    except Exception as e:
        print(f"Error opening file picker: {e}")
        return None


def load_excel_data(excel_path):
    """Load project data from Excel file"""
    print(f"📊 Loading Excel file: {Path(excel_path).name}")
    
    try:
        # Try to read Excel file
        df = pd.read_excel(excel_path)
        
        # Display columns found
        print(f"   Found columns: {', '.join(df.columns.tolist())}")
        
        # Create a dictionary mapping project code to location
        # Assume columns are named 'project_code' and 'location' (case insensitive)
        project_data = {}
        
        # Find the right columns (case insensitive)
        code_col = None
        location_col = None
        
        for col in df.columns:
            col_lower = col.lower().strip().replace('-', '').replace('_', '').replace(' ', '')
            
            # Look for project code column (more specific match)
            if not code_col and ('projectcode' in col_lower or col_lower == 'code'):
                code_col = col
            
            # Look for location column (avoid duplicates like location.1)
            if not location_col and 'location' in col_lower and '.' not in col:
                location_col = col
        
        if not code_col or not location_col:
            print(f"⚠️  Could not auto-detect columns")
            print(f"   Available columns: {', '.join(df.columns.tolist())}")
            print(f"   Code column found: {code_col if code_col else 'None'}")
            print(f"   Location column found: {location_col if location_col else 'None'}")
            print(f"   Please ensure your Excel has:")
            print(f"   - A column with 'code' in the name (e.g., 'project-code', 'code')")
            print(f"   - A column named 'location' (without duplicates)")
            return {}
        
        print(f"   ✅ Using columns: '{code_col}' → '{location_col}'")
        
        # Build lookup dictionary
        for _, row in df.iterrows():
            code = str(row[code_col]).strip()
            location = str(row[location_col]).strip()
            if code and code != 'nan' and location and location != 'nan':
                project_data[code] = location
        
        print(f"✅ Loaded {len(project_data)} project entries from Excel")
        
        # Show sample data
        if project_data:
            print(f"\n   📋 Sample entries:")
            for i, (code, loc) in enumerate(list(project_data.items())[:3]):
                print(f"      {code} → {loc}")
            if len(project_data) > 3:
                print(f"      ... and {len(project_data) - 3} more")
        print()
        
        return project_data
        
    except Exception as e:
        print(f"❌ Error loading Excel: {e}")
        return {}


def extract_project_code(folder_name):
    """Extract project code from folder name"""
    # Try to extract code pattern (e.g., "P001" or "2024-P001" etc.)
    # You can customize this based on your naming convention
    import re
    
    # Try to find patterns like: P001, PRJ-001, 2024-P001, etc.
    patterns = [
        r'P-?\d+',           # P001, P-001
        r'PRJ-?\d+',         # PRJ001, PRJ-001
        r'\d{4}-?P-?\d+',    # 2024P001, 2024-P-001
        r'[A-Z]+-?\d+',      # Any code pattern like ABC-123
    ]
    
    for pattern in patterns:
        match = re.search(pattern, folder_name, re.IGNORECASE)
        if match:
            return match.group(0).upper()
    
    # If no pattern found, return the folder name itself
    return folder_name


def get_image_date(image_path):
    """Get date from image file's modification time"""
    try:
        # Get file modification time
        mod_time = os.path.getmtime(image_path)
        date_obj = datetime.fromtimestamp(mod_time)
        return date_obj.strftime('%Y-%m-%d')
    except Exception as e:
        print(f"⚠️  Could not get date from {image_path.name}: {e}")
        # Return today's date as fallback
        return datetime.now().strftime('%Y-%m-%d')


def get_project_folders(main_folder):
    """Get all subdirectories (each is a project)"""
    main_path = Path(main_folder)
    return [f for f in main_path.iterdir() if f.is_dir() and not f.name.startswith('.')]


def get_images(folder):
    """Get all image files in a folder"""
    folder_path = Path(folder)
    images = []
    
    for ext in CONFIG["image_extensions"]:
        images.extend(folder_path.glob(f"*{ext}"))
        images.extend(folder_path.glob(f"*{ext.upper()}"))
    
    return sorted(images)


def image_to_base64(image_path):
    """Convert image to base64 for Gemini AI"""
    with open(image_path, 'rb') as f:
        return base64.b64encode(f.read()).decode('utf-8')


def analyze_project_with_ai(images, folder_name, location_name=None):
    """Analyze project images with Gemini AI and generate metadata"""
    global model
    
    if model is None:
        raise Exception("Gemini AI model not initialized")
    
    print("🤖 Analyzing images with Gemini AI...")
    
    try:
        # Use first 3 images to avoid rate limits
        images_to_analyze = images[:3]
        
        # Prepare images for Gemini
        image_parts = []
        for image_path in images_to_analyze:
            base64_data = image_to_base64(image_path)
            ext = image_path.suffix.lower().lstrip('.')
            mime_type = f"image/{ext if ext != 'jpg' else 'jpeg'}"
            
            image_parts.append({
                "mime_type": mime_type,
                "data": base64_data
            })
        
        # Create category list for AI
        category_list = ", ".join([f"{id}: {cat['en']}" for id, cat in CONFIG["categories"].items()])
        
        # Create subcategory list
        subcat_lines = []
        for cat_id, subs in CONFIG["subcategories"].items():
            sub_names = ", ".join([f"{s['id']}: {s['en']}" for s in subs])
            subcat_lines.append(f"Category {cat_id}: [{sub_names}]")
        subcat_list = "\n".join(subcat_lines)
        
        # Add location hint if available
        location_hint = f"\nProject location: {location_name}" if location_name else ""
        
        prompt = f"""You are an expert architectural analyst. Analyze these architectural project images and provide:

1. A professional project title in 3 languages (English, Kurdish Sorani, Arabic)
2. A detailed description (2-3 sentences) in 3 languages{" - mention the location in the description" if location_name else ""}
3. Select the most appropriate category ID from: {category_list}
4. If applicable, select a subcategory ID from:
{subcat_list}

Folder name hint: "{folder_name}"{location_hint}

Respond ONLY in this EXACT JSON format (no markdown, no explanation):
{{
  "title_en": "English title here",
  "title_ku": "Kurdish title here (use Kurdish Sorani script)",
  "title_ar": "Arabic title here (use Arabic script)",
  "description_en": "English description here",
  "description_ku": "Kurdish description here (use Kurdish Sorani script)",
  "description_ar": "Arabic description here (use Arabic script)",
  "category_id": 7,
  "subcategory_id": 1
}}

If no suitable subcategory, use: "subcategory_id": null

Make titles concise (3-6 words) and descriptions informative but brief."""

        # Generate content with images
        content_parts = [prompt]
        for img_part in image_parts:
            content_parts.append({
                "inline_data": {
                    "mime_type": img_part["mime_type"],
                    "data": img_part["data"]
                }
            })
        
        response = model.generate_content(content_parts)
        text = response.text
        
        # Clean up response (remove markdown code blocks if present)
        text = text.replace('```json', '').replace('```', '').strip()
        
        print(f"📄 AI Response: {text[:200]}...")
        
        data = json.loads(text)
        
        # Validate category
        if data["category_id"] not in CONFIG["categories"]:
            print("⚠️  Invalid category, defaulting to Interior Design (7)")
            data["category_id"] = 7
        
        # Validate subcategory
        if data.get("subcategory_id"):
            valid_subs = CONFIG["subcategories"].get(data["category_id"], [])
            is_valid = any(s["id"] == data["subcategory_id"] for s in valid_subs)
            if not is_valid:
                print("⚠️  Invalid subcategory, setting to null")
                data["subcategory_id"] = None
        
        return data
        
    except Exception as e:
        print(f"❌ AI Analysis Error: {e}")
        
        # Fallback data
        print("📝 Using fallback data based on folder name...")
        return {
            "title_en": folder_name,
            "title_ku": folder_name,
            "title_ar": folder_name,
            "description_en": f"Architectural project: {folder_name}",
            "description_ku": f"پرۆژەی تەلارسازی: {folder_name}",
            "description_ar": f"مشروع معماري: {folder_name}",
            "category_id": 7,
            "subcategory_id": None,
        }


def upload_image_to_cloud(image_path, max_retries=3):
    """Upload image to cloud storage with retry logic"""
    print(f"📤 Uploading: {image_path.name}")
    
    for attempt in range(max_retries):
        try:
            url = f"{CONFIG['cloud']['base_url']}/file/upload?allowDuplicates=true"
            
            with open(image_path, 'rb') as f:
                files = {'file': (image_path.name, f, 'image/jpeg')}
                headers = {'X-API-Key': CONFIG['cloud']['api_key']}
                
                response = requests.post(url, files=files, headers=headers)
            
            # HTTP 200 (OK) and 201 (Created) are both success statuses
            if response.status_code == 429:
                # Rate limited - wait longer and retry
                wait_time = (attempt + 1) * 5  # 5s, 10s, 15s
                print(f"⚠️  Rate limited. Waiting {wait_time} seconds before retry {attempt + 1}/{max_retries}...")
                time.sleep(wait_time)
                continue
            
            if response.status_code not in [200, 201]:
                raise Exception(f"Upload failed: {response.status_code} {response.text}")
            
            data = response.json()
            
            # Check if upload was successful
            if not data.get('success'):
                raise Exception("Upload failed: " + data.get('message', 'Unknown error'))
            
            # Get file ID from response (it's in data.data.id)
            file_id = data.get('data', {}).get('id')
            
            if not file_id:
                raise Exception("Upload response missing file ID")
            
            # Use proxy route to avoid rate limiting (Next.js will cache this)
            # This goes through YOUR server, not directly to cloud API
            proxy_url = f"/api/cloud/files/{file_id}"
            
            print(f"✅ Uploaded: {file_id}")
            return proxy_url
            
        except Exception as e:
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 3
                print(f"⚠️  Upload failed: {e}")
                print(f"🔄 Retrying in {wait_time} seconds... (Attempt {attempt + 2}/{max_retries})")
                time.sleep(wait_time)
            else:
                print(f"❌ Upload error for {image_path.name} after {max_retries} attempts: {e}")
                return None
    
    return None


def create_project_in_database(connection, project_data, image_ids, location_id=None, project_date=None):
    """Create project in database"""
    print("💾 Creating project in database...")
    
    try:
        cursor = connection.cursor()
        
        # Use provided date or current date as fallback
        date_value = project_date if project_date else datetime.now().strftime('%Y-%m-%d')
        
        # Use provided location ID or default to 11 (Sulaymaniyah)
        loc_id = location_id if location_id else CONFIG["default_location_id"]
        
        # Insert project (using actual database column names)
        insert_project = """
        INSERT INTO projects (
            title_en, title_ku, title_ar,
            description_en, description_ku, description_ar,
            project_category, project_sub_category,
            location_id,
            date, project_status, is_published
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 1, 1)
        """
        
        cursor.execute(insert_project, (
            project_data["title_en"],
            project_data["title_ku"],
            project_data["title_ar"],
            project_data["description_en"],
            project_data["description_ku"],
            project_data["description_ar"],
            project_data["category_id"],
            project_data["subcategory_id"],
            loc_id,
            date_value,
        ))
        
        project_id = cursor.lastrowid
        print(f"✅ Project created with ID: {project_id}")
        
        # Insert gallery images (using actual database column names)
        if image_ids:
            valid_ids = [img_id for img_id in image_ids if img_id]
            print(f"📸 Adding {len(valid_ids)} images to gallery...")
            
            for i, image_id in enumerate(image_ids):
                if image_id:
                    insert_image = """
                    INSERT INTO galleries (parent_id, parent_type, image_url, order_index)
                    VALUES (%s, '0', %s, %s)
                    """
                    # parent_type '0' = project (assuming based on enum values)
                    cursor.execute(insert_image, (project_id, image_id, i + 1))
            
            print(f"✅ Added {len(valid_ids)} images to gallery")
        
        connection.commit()
        return project_id
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        connection.rollback()
        raise


def process_project(connection, project_folder, folder_name, excel_data=None):
    """Process a single project folder"""
    print("\n" + "=" * 70)
    print(f"📁 Processing: {folder_name}")
    print("=" * 70)
    
    try:
        # Extract project code from folder name
        project_code = extract_project_code(folder_name)
        print(f"🔢 Project Code: {project_code}")
        
        # Get location from Excel data and convert to ID
        location_name = None
        location_id = None
        
        if excel_data and project_code in excel_data:
            location_name = excel_data[project_code]
            print(f"📍 Location (from Excel): {location_name}")
            
            # Convert location name to ID
            location_lower = location_name.lower().strip()
            if location_lower in CONFIG["locations"]:
                location_id = CONFIG["locations"][location_lower]
                print(f"   → Location ID: {location_id}")
            else:
                print(f"   ⚠️  Location '{location_name}' not in database, using default (ID: {CONFIG['default_location_id']})")
                location_id = CONFIG["default_location_id"]
        else:
            print(f"⚠️  Location not found in Excel for code: {project_code}")
            print(f"   → Using default location ID: {CONFIG['default_location_id']} (Sulaymaniyah)")
            location_id = CONFIG["default_location_id"]
        
        # Get images
        images = get_images(project_folder)
        
        if not images:
            print("⚠️  No images found, skipping...")
            return {"success": False, "reason": "No images"}
        
        print(f"📸 Found {len(images)} images")
        
        # Get date from first image
        project_date = get_image_date(images[0])
        print(f"📅 Project Date (from image): {project_date}")
        
        # Analyze with AI (pass location name for inclusion in description)
        project_data = analyze_project_with_ai(images, folder_name, location_name=location_name)
        
        print("\n📋 Project Data:")
        print(f"   Title (EN): {project_data['title_en']}")
        print(f"   Title (KU): {project_data['title_ku']}")
        print(f"   Title (AR): {project_data['title_ar']}")
        print(f"   Category: {CONFIG['categories'][project_data['category_id']]['en']}")
        
        if project_data.get("subcategory_id"):
            subcat = next(
                (s for s in CONFIG["subcategories"].get(project_data["category_id"], []) 
                 if s["id"] == project_data["subcategory_id"]),
                None
            )
            if subcat:
                print(f"   Subcategory: {subcat['en']}")
        
        # Automatically proceed with upload (no confirmation needed)
        print("\n🚀 Uploading project automatically...")
        
        # Upload images
        print("\n📤 Uploading images to cloud storage...")
        image_ids = []
        for idx, img in enumerate(images, 1):
            img_id = upload_image_to_cloud(img)
            image_ids.append(img_id)
            
            # Progress indicator
            print(f"✅ Uploaded {idx}/{len(images)}")
            
            # Wait 2 seconds between uploads to avoid rate limiting
            if idx < len(images):  # Don't wait after last image
                print(f"⏳ Waiting 2 seconds to avoid rate limit...")
                time.sleep(2)
        
        successful_uploads = [id for id in image_ids if id]
        print(f"✅ Uploaded {len(successful_uploads)}/{len(images)} images")
        
        if not successful_uploads:
            print("❌ No images uploaded successfully")
            return {"success": False, "reason": "Upload failed"}
        
        # Create project in database
        project_id = create_project_in_database(
            connection, 
            project_data, 
            image_ids,
            location_id=location_id,
            project_date=project_date
        )
        
        print(f"\n🎉 SUCCESS! Project #{project_id} created!")
        print(f"   Title: {project_data['title_en']}")
        print(f"   Location: {location_name if location_name else 'Default (Sulaymaniyah)'} (ID: {location_id})")
        print(f"   Date: {project_date}")
        print(f"   Images: {len(successful_uploads)}")
        
        return {
            "success": True,
            "project_id": project_id,
            "title": project_data["title_en"],
            "images": len(successful_uploads),
        }
        
    except Exception as e:
        print(f"❌ Error processing project: {e}")
        return {"success": False, "reason": str(e)}


def main():
    print("🚀 AI-Powered Bulk Project Upload (Fully Automatic)")
    print("=" * 70)
    print("   📁 Step 1: Select folder with projects")
    print("   📊 Step 2: Select Excel file (optional)")
    print("   ⚡ Step 3: Watch automatic upload!")
    print("=" * 70)
    print()
    
    # Initialize Gemini AI
    if not initialize_gemini():
        print("\n❌ Cannot continue without Gemini AI")
        return
    
    # Get main folder
    main_folder = select_folder_gui()
    
    if not main_folder:
        print("❌ No folder selected")
        return
    
    # Verify folder exists
    if not Path(main_folder).is_dir():
        print(f"❌ Folder not found: {main_folder}")
        return
    
    # Get Excel file with project data
    excel_file = select_excel_file_gui()
    excel_data = {}
    
    if excel_file:
        excel_data = load_excel_data(excel_file)
        if not excel_data:
            print("⚠️  No valid data loaded from Excel")
            print("   Continuing without location data...\n")
    else:
        print("⚠️  No Excel file selected")
        print("   Continuing without location data...\n")
    
    # Get project folders
    print("\n🔍 Scanning for project folders...")
    project_folders = get_project_folders(main_folder)
    
    if not project_folders:
        print("❌ No subfolders found")
        return
    
    print(f"✅ Found {len(project_folders)} project folders")
    
    # Show folder list
    print("\n📋 Projects found:")
    for i, folder in enumerate(project_folders, 1):
        print(f"   {i}. {folder.name}")
    
    # Connect to database
    print("\n📊 Connecting to database...")
    try:
        connection = mysql.connector.connect(**CONFIG["db"])
        print("✅ Connected to database\n")
    except Exception as e:
        print(f"❌ Database connection error: {e}")
        return
    
    # Process each project automatically
    print("\n🚀 Starting automatic upload of all projects...\n")
    
    results = {
        "total": len(project_folders),
        "success": 0,
        "failed": 0,
        "projects": [],
    }
    
    for i, folder in enumerate(project_folders, 1):
        print(f"\n[{i}/{len(project_folders)}]")
        
        result = process_project(connection, folder, folder.name, excel_data=excel_data)
        
        if result["success"]:
            results["success"] += 1
            results["projects"].append({
                "id": result["project_id"],
                "title": result["title"],
                "images": result["images"],
            })
        else:
            results["failed"] += 1
        
        # Small delay between projects
        time.sleep(1)
    
    # Close connection
    connection.close()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 UPLOAD SUMMARY")
    print("=" * 70)
    print(f"Total projects: {results['total']}")
    print(f"✅ Successful: {results['success']}")
    print(f"❌ Failed: {results['failed']}")
    
    if results["projects"]:
        print("\n📋 Created Projects:")
        for p in results["projects"]:
            print(f"   #{p['id']}: {p['title']} ({p['images']} images)")
    
    print("\n✨ Done!\n")


if __name__ == "__main__":
    try:
        # Verify all imports worked
        print("🔍 Checking dependencies...")
        print(f"   Python: {sys.version.split()[0]}")
        print(f"   Pandas: {pd.__version__}")
        print(f"   MySQL Connector: OK")
        print(f"   Requests: OK")
        print(f"   Google Gemini: OK")
        print()
        
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Operation cancelled by user")
    except Exception as e:
        import traceback
        print(f"\n❌ Fatal error: {e}")
        print("\n📋 Full error details:")
        traceback.print_exc()
        print("\n💡 If you see import errors, try:")
        print("   pip3 install --upgrade google-generativeai pandas openpyxl mysql-connector-python requests Pillow")
        exit(1)
