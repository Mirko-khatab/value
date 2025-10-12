-- Create audios table for managing background music
-- Run this SQL in your MySQL database

CREATE TABLE IF NOT EXISTS `audios` (
  `id` VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  `title_ku` VARCHAR(255) NOT NULL,
  `title_en` VARCHAR(255) NOT NULL,
  `title_ar` VARCHAR(255) NOT NULL,
  `audio_url` TEXT NOT NULL,
  `is_active` BOOLEAN DEFAULT TRUE,
  `use_for` ENUM('landing', 'intro', 'both') DEFAULT 'landing',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for faster queries
CREATE INDEX idx_is_active ON audios(is_active);
CREATE INDEX idx_use_for ON audios(use_for);

