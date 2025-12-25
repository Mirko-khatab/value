-- Create missing tables for ValueArch Dashboard
-- Run this with: mysql -u root -padmin123 dashboard < create-missing-tables.sql

USE dashboard;

-- Create teams table (if not exists)
CREATE TABLE IF NOT EXISTS teams (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name_en VARCHAR(155) NOT NULL,
  name_ku VARCHAR(155) NOT NULL,
  name_ar VARCHAR(155) NOT NULL,
  position_en VARCHAR(155),
  position_ku VARCHAR(155),
  position_ar VARCHAR(155),
  bio_en TEXT,
  bio_ku TEXT,
  bio_ar TEXT,
  image_url VARCHAR(500),
  email VARCHAR(255),
  phone VARCHAR(50),
  social_links JSON,
  order_index INT DEFAULT 1,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Fix event table (if exists)
ALTER TABLE event 
  ADD PRIMARY KEY (id),
  MODIFY id INT NOT NULL AUTO_INCREMENT;

-- Fix banners table (check if it has PRIMARY KEY first)
-- ALTER TABLE banners ADD PRIMARY KEY (id), MODIFY id INT NOT NULL AUTO_INCREMENT;

SELECT 'Tables created/fixed successfully!' AS status;

-- Show all tables
SHOW TABLES;
