-- =====================================================
-- Automatic Theme System Setup
-- =====================================================
-- This script sets up the automatic Christmas theme
-- that enables Dec 27 - Jan 1 every year
-- =====================================================

-- Create theme settings table
CREATE TABLE IF NOT EXISTS theme_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  theme_name VARCHAR(50) NOT NULL UNIQUE COMMENT 'Name of the theme (e.g., christmas, halloween)',
  is_enabled BOOLEAN DEFAULT FALSE COMMENT 'Manual enable/disable override',
  auto_enable BOOLEAN DEFAULT FALSE COMMENT 'Enable automatic date-based activation',
  start_date VARCHAR(10) DEFAULT NULL COMMENT 'Start date in MM-DD format (e.g., 12-27)',
  end_date VARCHAR(10) DEFAULT NULL COMMENT 'End date in MM-DD format (e.g., 01-01)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_theme_name (theme_name),
  INDEX idx_enabled (is_enabled),
  INDEX idx_auto_enable (auto_enable)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores configuration for seasonal themes and decorations';

-- Insert Christmas theme settings
-- auto_enable = TRUE: Automatically enables during date range
-- start_date = 12-27: December 27
-- end_date = 01-01: January 1
-- This gives 6 days: Dec 27, 28, 29, 30, 31, Jan 1
INSERT INTO theme_settings (theme_name, is_enabled, auto_enable, start_date, end_date) 
VALUES ('christmas', FALSE, TRUE, '12-27', '01-01')
ON DUPLICATE KEY UPDATE 
  auto_enable = TRUE,
  start_date = '12-27',
  end_date = '01-01';

-- Verify installation
SELECT 
  theme_name,
  is_enabled as 'Manual Override',
  auto_enable as 'Auto Schedule',
  CONCAT(start_date, ' to ', end_date) as 'Date Range',
  CASE 
    WHEN auto_enable = 1 THEN 'Will auto-enable during date range'
    WHEN is_enabled = 1 THEN 'Manually enabled (always on)'
    ELSE 'Disabled'
  END as 'Status'
FROM theme_settings;

-- =====================================================
-- Optional: Add more themes
-- =====================================================

-- Halloween theme (Oct 25-31)
-- INSERT INTO theme_settings (theme_name, auto_enable, start_date, end_date) 
-- VALUES ('halloween', TRUE, '10-25', '10-31')
-- ON DUPLICATE KEY UPDATE auto_enable = TRUE, start_date = '10-25', end_date = '10-31';

-- Valentine's Day (Feb 14)
-- INSERT INTO theme_settings (theme_name, auto_enable, start_date, end_date) 
-- VALUES ('valentines', TRUE, '02-14', '02-14')
-- ON DUPLICATE KEY UPDATE auto_enable = TRUE, start_date = '02-14', end_date = '02-14';

-- =====================================================
-- Quick Commands
-- =====================================================

-- Manually enable Christmas theme (testing)
-- UPDATE theme_settings SET is_enabled = 1 WHERE theme_name = 'christmas';

-- Manually disable Christmas theme
-- UPDATE theme_settings SET is_enabled = 0 WHERE theme_name = 'christmas';

-- Disable automatic schedule (manual control only)
-- UPDATE theme_settings SET auto_enable = 0 WHERE theme_name = 'christmas';

-- Change date range (e.g., Dec 20 - Jan 5)
-- UPDATE theme_settings SET start_date = '12-20', end_date = '01-05' WHERE theme_name = 'christmas';

-- Check current settings
-- SELECT * FROM theme_settings WHERE theme_name = 'christmas';

-- =====================================================
-- Installation Complete!
-- =====================================================
-- Theme will automatically enable Dec 27 - Jan 1
-- Control panel: https://valuearch.com/dashboard/settings/theme
-- =====================================================
