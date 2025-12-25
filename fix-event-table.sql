-- Fix event table AUTO_INCREMENT
-- Run this with: mysql -u root -padmin123 dashboard < fix-event-table.sql

ALTER TABLE event ADD PRIMARY KEY (id);
ALTER TABLE event MODIFY id INT NOT NULL AUTO_INCREMENT;

-- Verify
SELECT 'Event table fixed!' AS status;
DESCRIBE event;
