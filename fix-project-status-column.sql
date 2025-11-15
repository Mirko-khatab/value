-- Fix project_status column type
-- Run this in your database to fix the column type issue

-- First, check if the column exists and modify it to the correct type
ALTER TABLE projects 
MODIFY COLUMN project_status INT DEFAULT 0;

-- If you get an error that the column doesn't exist, run this instead:
-- ALTER TABLE projects ADD COLUMN project_status INT DEFAULT 0;

