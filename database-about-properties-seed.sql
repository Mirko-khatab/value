-- Insert about page statistics into existing properties table
-- Make sure to run this after checking if these keys already exist

INSERT INTO properties (`key`, value_ku, value_ar, value_en) VALUES
('about_years_experience', '5+', '5+', '5+'),
('about_completed_projects', '150+', '150+', '150+'),
('about_satisfied_clients', '100+', '100+', '100+'),
('about_team_members', '15+', '15+', '15+')
ON DUPLICATE KEY UPDATE
value_ku = VALUES(value_ku),
value_ar = VALUES(value_ar),
value_en = VALUES(value_en);

-- You can also add labels for these statistics
INSERT INTO properties (`key`, value_ku, value_ar, value_en) VALUES
('about_years_experience_label', 'ساڵ ئەزموون', 'سنوات الخبرة', 'Years Experience'),
('about_completed_projects_label', 'پڕۆژەی تەواوکراو', 'المشاريع المكتملة', 'Completed Projects'),
('about_satisfied_clients_label', 'کڕیاری ڕازی', 'العملاء الراضون', 'Satisfied Clients'),
('about_team_members_label', 'ئەندامی تیم', 'أعضاء الفريق', 'Team Members')
ON DUPLICATE KEY UPDATE
value_ku = VALUES(value_ku),
value_ar = VALUES(value_ar),
value_en = VALUES(value_en);
