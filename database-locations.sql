-- ============================================
-- COUNTRIES AND LOCATIONS TABLE MIGRATION
-- ============================================
-- This migration creates normalized tables for countries and locations (cities)
-- with proper foreign key relationships
-- ============================================

-- Create countries table first
CREATE TABLE IF NOT EXISTS countries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_ku VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  code VARCHAR(3) NULL COMMENT 'ISO 3166-1 alpha-3 country code',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_name_en (name_en),
  INDEX idx_name_en (name_en),
  INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create locations (cities) table with foreign key to countries
CREATE TABLE IF NOT EXISTS locations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  country_id INT NOT NULL,
  city_ku VARCHAR(255) NOT NULL,
  city_ar VARCHAR(255) NOT NULL,
  city_en VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_city_en (city_en),
  INDEX idx_country_id (country_id),
  CONSTRAINT fk_locations_country 
    FOREIGN KEY (country_id) 
    REFERENCES countries(id) 
    ON DELETE RESTRICT 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample countries
INSERT INTO countries (name_ku, name_ar, name_en, code) VALUES
('عێراق', 'العراق', 'Iraq', 'IRQ'),
('تورکیا', 'تركيا', 'Turkey', 'TUR'),
('ئێران', 'إيران', 'Iran', 'IRN'),
('سوریا', 'سوريا', 'Syria', 'SYR'),
('وڵاتە یەکگرتووەکانی ئەمەریکا', 'الولايات المتحدة الأمريكية', 'United States', 'USA'),
('شانشینی یەکگرتوو', 'المملكة المتحدة', 'United Kingdom', 'GBR'),
('ئەڵمانیا', 'ألمانيا', 'Germany', 'DEU'),
('فەرەنسا', 'فرنسا', 'France', 'FRA');

-- Insert all major Iraqi cities (43 cities total)
-- Iraq has 18 governorates - including capitals and major cities
INSERT INTO locations (country_id, city_ku, city_ar, city_en) VALUES
-- 1. Baghdad Governorate (Capital)
(1, 'بەغدا', 'بغداد', 'Baghdad'),

-- 2. Basra Governorate
(1, 'بەسرە', 'البصرة', 'Basra'),
(1, 'زوبەیر', 'الزبير', 'Zubair'),
(1, 'قورنە', 'القرنة', 'Al-Qurna'),

-- 3. Nineveh Governorate
(1, 'موسڵ', 'الموصل', 'Mosul'),
(1, 'تەلەعفەر', 'تلعفر', 'Tal Afar'),
(1, 'سنجار', 'سنجار', 'Sinjar'),

-- 4. Erbil Governorate (Kurdistan Region)
(1, 'هەولێر', 'أربيل', 'Erbil'),
(1, 'کۆیە', 'كويسنجق', 'Koya'),
(1, 'شەقڵاوە', 'شقلاوة', 'Shaqlawa'),

-- 5. Sulaymaniyah Governorate (Kurdistan Region)
(1, 'سلێمانی', 'السليمانية', 'Sulaymaniyah'),
(1, 'ڕانیە', 'رانية', 'Rania'),
(1, 'قەڵادزێ', 'قلعة دزة', 'Qalat Dizah'),

-- 6. Duhok Governorate (Kurdistan Region)
(1, 'دهۆک', 'دهوك', 'Duhok'),
(1, 'زاخۆ', 'زاخو', 'Zakho'),
(1, 'ئاكرێ', 'عقرة', 'Akre'),

-- 7. Kirkuk Governorate
(1, 'کەرکوک', 'كركوك', 'Kirkuk'),

-- 8. Anbar Governorate
(1, 'ڕەمادی', 'الرمادي', 'Ramadi'),
(1, 'فەلووجە', 'الفلوجة', 'Fallujah'),
(1, 'حەدیسە', 'حديثة', 'Haditha'),

-- 9. Babil Governorate
(1, 'حیلە', 'الحلة', 'Hillah'),
(1, 'مەحاویل', 'المحاويل', 'Mahawil'),

-- 10. Karbala Governorate
(1, 'کەربەلا', 'كربلاء', 'Karbala'),

-- 11. Najaf Governorate
(1, 'نەجەف', 'النجف', 'Najaf'),
(1, 'کووفە', 'الكوفة', 'Kufa'),

-- 12. Wasit Governorate
(1, 'کووت', 'الكوت', 'Al-Kut'),
(1, 'عەزیزیە', 'العزيزية', 'Al-Aziziya'),

-- 13. Saladin Governorate
(1, 'تکریت', 'تكريت', 'Tikrit'),
(1, 'سامەڕا', 'سامراء', 'Samarra'),
(1, 'بەیجی', 'بيجي', 'Baiji'),

-- 14. Diyala Governorate
(1, 'بەعقووبە', 'بعقوبة', 'Baqubah'),
(1, 'خانەقین', 'خانقين', 'Khanaqin'),
(1, 'مەندەلی', 'مندلي', 'Mandali'),

-- 15. Qadisiyyah Governorate
(1, 'دیوانیە', 'الديوانية', 'Diwaniya'),
(1, 'عەفەک', 'عفك', 'Afak'),

-- 16. Dhi Qar Governorate
(1, 'ناسریە', 'الناصرية', 'Nasiriyah'),
(1, 'شەترە', 'الشطرة', 'Shatra'),

-- 17. Maysan Governorate
(1, 'عەمارە', 'العمارة', 'Amarah'),
(1, 'قەڵەت سالح', 'قلعة صالح', 'Qalat Saleh'),

-- 18. Muthanna Governorate
(1, 'سەماوە', 'السماوة', 'Samawah'),
(1, 'ڕومەیسە', 'الرميثة', 'Rumaitha'),

-- 19. Halabja Governorate (Kurdistan Region - 4th governorate)
(1, 'هەڵەبجە', 'حلبجة', 'Halabja'),

-- Additional Important Cities
(1, 'ئامێدی', 'العمادية', 'Amedi'),
(1, 'ڕەواندوز', 'راوندوز', 'Rawanduz'),
(1, 'سۆران', 'سوران', 'Soran'),
(1, 'مەخموور', 'مخمور', 'Makhmur'),
(1, 'تێڵکەیف', 'تلكيف', 'Telkaif'),
(1, 'هیت', 'هيت', 'Hit');

-- ============================================
-- MODIFY PROJECTS TABLE
-- ============================================
-- Add location_id column and update existing projects
-- This will replace the old location_ku, location_ar, location_en text fields
-- ============================================

-- Add new location_id column to projects table
ALTER TABLE projects 
ADD COLUMN location_id INT NULL AFTER project_status,
ADD CONSTRAINT fk_projects_location 
  FOREIGN KEY (location_id) 
  REFERENCES locations(id) 
  ON DELETE SET NULL 
  ON UPDATE CASCADE;

-- Create index for faster lookups
ALTER TABLE projects 
ADD INDEX idx_location_id (location_id);

-- Optional: Update existing projects with default location (Erbil)
-- You can run this after the migration if you have existing data
-- UPDATE projects SET location_id = 1 WHERE location_id IS NULL;

-- Optional: After confirming location_id is working, you can drop the old columns
-- Run these commands ONLY after you've migrated all data and tested:
-- ALTER TABLE projects DROP COLUMN location_ku;
-- ALTER TABLE projects DROP COLUMN location_ar;
-- ALTER TABLE projects DROP COLUMN location_en;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify the migration worked correctly:

-- Check countries table
-- SELECT * FROM countries;

-- Check locations table with country names
-- SELECT 
--   l.id,
--   l.city_en,
--   l.city_ar,
--   l.city_ku,
--   c.name_en as country_en,
--   c.name_ar as country_ar,
--   c.name_ku as country_ku
-- FROM locations l
-- JOIN countries c ON l.country_id = c.id;

-- Check projects structure
-- DESCRIBE projects;

-- Check projects with location and country details
-- SELECT 
--   p.id,
--   p.title_en,
--   l.city_en,
--   c.name_en as country_en
-- FROM projects p
-- LEFT JOIN locations l ON p.location_id = l.id
-- LEFT JOIN countries c ON l.country_id = c.id;

