-- =============================================================================
-- DATABASE MIGRATIONS
-- Run these SQL commands in your database
-- =============================================================================

-- 1. Create project_categories table
CREATE TABLE IF NOT EXISTS project_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title_ku VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Add new columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_category INT,
ADD COLUMN IF NOT EXISTS project_status INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS location_ku VARCHAR(255),
ADD COLUMN IF NOT EXISTS location_en VARCHAR(255),
ADD COLUMN IF NOT EXISTS location_ar VARCHAR(255),
ADD FOREIGN KEY (project_category) REFERENCES project_categories(id) ON DELETE SET NULL;

-- 3. Insert some sample project categories (optional)
INSERT INTO project_categories (title_ku, title_en, title_ar) VALUES
('بینا', 'Construction', 'بناء'),
('پیشەسازی', 'Industrial', 'صناعي'),
('ژینگەی', 'Environmental', 'بيئي');

