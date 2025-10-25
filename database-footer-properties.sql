-- Footer Properties Table
CREATE TABLE IF NOT EXISTS footer_properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_key VARCHAR(100) NOT NULL UNIQUE,
  title_en VARCHAR(255) NOT NULL,
  title_ar VARCHAR(255) NOT NULL,
  title_ku VARCHAR(255) NOT NULL,
  content_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  content_ku TEXT NOT NULL,
  property_type ENUM('about', 'stats', 'contact', 'social') NOT NULL DEFAULT 'about',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert footer properties with your brand information
INSERT INTO footer_properties (property_key, title_en, title_ar, title_ku, content_en, content_ar, content_ku, property_type, display_order) VALUES

-- About Company
('company_about', 'About Value Architects', 'حول شركة فاليو للمعمار', 'دەربارەی ڤالیو ئارکیتێکتس', 
'Established in 2020, our engineering office in Sulaymaniyah, Kurdistan Region of Iraq, is registered with the Kurdistan Engineering Union (KEU) under number 308. Our firm specializes in designing, implementing, and supervising a wide range of engineering projects.',
'تأسس مكتبنا الهندسي في السليمانية، إقليم كردستان العراق عام 2020، ومسجل لدى نقابة المهندسين الكردستانية تحت الرقم 308. تختص شركتنا في تصميم وتنفيذ والإشراف على مجموعة واسعة من المشاريع الهندسية.',
'نووسینگەی ئەندازیاریمان لە ساڵی ٢٠٢٠ لە سلێمانی، هەرێمی کوردستانی عێراق دامەزراوە و لە ژێر ژمارە ٣٠٨ لە یەکێتیی ئەندازیارانی کوردستان تۆمارکراوە. کۆمپانیاکەمان پسپۆڕە لە دیزاین و جێبەجێکردن و سەرپەرشتیکردنی کۆمەڵێک پڕۆژەی ئەندازیاری.',
'about', 1),

-- Company Mission
('company_mission', 'Our Mission', 'مهمتنا', 'ئامانجەکانمان',
'With a dedicated team comprising architects, civil, mechanical, and electrical engineers, we are committed to delivering innovative and effective solutions tailored to our clients needs.',
'مع فريق متخصص يضم مهندسين معماريين ومدنيين وميكانيكيين وكهربائيين، نحن ملتزمون بتقديم حلول مبتكرة وفعالة مصممة خصيصاً لاحتياجات عملائنا.',
'لەگەڵ تیمێکی تایبەت کە پێکهاتووە لە ئەندازیارانی بیناسازی، مەدەنی، مەکانیکی و کارەبایی، ئێمە پابەندین بە پێشکەشکردنی چارەسەری داهێنەرانە و کاریگەر کە بە پێی پێداویستیەکانی کڕیارەکانمان دیزاین کراون.',
'about', 2),

-- Location
('company_location', 'Our Location', 'موقعنا', 'شوێنەکەمان',
'Sulaymaniyah, Kurdistan Region of Iraq',
'السليمانية، إقليم كردستان العراق',
'سلێمانی، هەرێمی کوردستانی عێراق',
'contact', 1),

-- Registration
('company_registration', 'Registration', 'التسجيل', 'تۆمارکردن',
'Kurdistan Engineering Union (KEU) - License #308',
'نقابة المهندسين الكردستانية - رخصة رقم ٣٠٨',
'یەکێتیی ئەندازیارانی کوردستان - مۆڵەت ژمارە ٣٠٨',
'about', 3),

-- Statistics - Projects Completed
('stats_projects', 'Total Projects', 'إجمالي المشاريع', 'کۆی پڕۆژەکان',
'500+',
'٥٠٠+',
'٥٠٠+',
'stats', 1),

-- Statistics - Landscape Projects
('stats_landscape', 'Landscape Projects', 'مشاريع المناظر الطبيعية', 'پڕۆژەی دیمەنسازی',
'9',
'٩',
'٩',
'stats', 2),

-- Statistics - Interior Designs
('stats_interior', 'Interior Designs', 'التصاميم الداخلية', 'دیزاینی ناوەوە',
'185',
'١٨٥',
'١٨٥',
'stats', 3),

-- Statistics - Houses
('stats_houses', 'Houses Designed', 'المنازل المصممة', 'خانووی دیزاینکراو',
'260',
'٢٦٠',
'٢٦٠',
'stats', 4),

-- Statistics - Factories
('stats_factories', 'Factories', 'المصانع', 'کارگەکان',
'58',
'٥٨',
'٥٨',
'stats', 5),

-- Statistics - Project Checks
('stats_checks', 'Project Inspections', 'فحوصات المشاريع', 'پشکنینی پڕۆژەکان',
'219',
'٢١٩',
'٢١٩',
'stats', 6),

-- Statistics - Commercial Buildings
('stats_commercial', 'Commercial Buildings', 'المباني التجارية', 'بیناکانی بازرگانی',
'73',
'٧٣',
'٧٣',
'stats', 7),

-- Statistics - Exterior Designs
('stats_exterior', 'Exterior Designs', 'التصاميم الخارجية', 'دیزاینی دەرەوە',
'102',
'١٠٢',
'١٠٢',
'stats', 8),

-- Statistics - Products
('stats_products', 'Original Products', 'المنتجات الأصلية', 'بەرهەمی ڕەسەن',
'20',
'٢٠',
'٢٠',
'stats', 9),

-- Statistics - Graphics
('stats_graphics', 'Graphic Designs', 'التصاميم الجرافيكية', 'دیزاینی گرافیکی',
'60',
'٦٠',
'٦٠',
'stats', 10);

