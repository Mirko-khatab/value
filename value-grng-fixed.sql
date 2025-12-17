-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 15, 2025 at 01:39 PM
-- Server version: 10.6.22-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dashboard`
--

-- --------------------------------------------------------

--
-- Table structure for table `about_stats`
--

CREATE TABLE `about_stats` (
  `id` int(11) NOT NULL,
  `stat_key` varchar(100) NOT NULL,
  `stat_value` varchar(50) NOT NULL,
  `label_ku` varchar(255) DEFAULT NULL,
  `label_ar` varchar(255) DEFAULT NULL,
  `label_en` varchar(255) DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `about_stats`
--

INSERT INTO `about_stats` (`id`, `stat_key`, `stat_value`, `label_ku`, `label_ar`, `label_en`, `display_order`, `created_at`, `updated_at`) VALUES
(1, 'years_experience', '5+', 'ساڵ ئەزموون', 'سنوات الخبرة', 'Years Experience', 1, '2025-10-20 16:26:51', '2025-10-20 16:26:51'),
(2, 'completed_projects', '150+', 'پڕۆژەی تەواوکراو', 'المشاريع المكتملة', 'Completed Projects', 2, '2025-10-20 16:26:51', '2025-10-20 16:26:51'),
(3, 'satisfied_clients', '100+', 'کڕیاری ڕازی', 'العملاء الراضون', 'Satisfied Clients', 3, '2025-10-20 16:26:51', '2025-10-20 16:26:51'),
(4, 'team_members', '15+', 'ئەندامی تیم', 'أعضاء الفريق', 'Team Members', 4, '2025-10-20 16:26:51', '2025-10-20 16:26:51');

-- --------------------------------------------------------

--
-- Table structure for table `audios`
--

CREATE TABLE `audios` (
  `id` varchar(36) NOT NULL ,
  `title_ku` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `audio_url` text NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `use_for` enum('landing','intro','both') DEFAULT 'landing',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `audios`
--

INSERT INTO `audios` (`id`, `title_ku`, `title_en`, `title_ar`, `audio_url`, `is_active`, `use_for`, `created_at`, `updated_at`) VALUES
('42fab00a-ced1-11f0-99fe-9200069919c7', 'landing', 'landing', 'landing', '/api/cloud/files/f9ef585b-ba4b-4c85-ae4f-290ab4b4ff57', 1, 'landing', '2025-12-01 16:17:41', '2025-12-01 16:17:41'),
('f45218da-b394-11f0-99fe-9200069919c7', 'intro', 'intro', 'intro', '/api/cloud/files/fa33ba51-15be-4bc3-bd8e-0d41bd2c42ac', 1, 'intro', '2025-10-28 00:27:58', '2025-10-28 01:06:40');

-- --------------------------------------------------------

--
-- Table structure for table `banners`
--

CREATE TABLE `banners` (
  `id` varchar(36) NOT NULL ,
  `title_ku` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `video_url` varchar(500) DEFAULT '',
  `type` enum('image','video') NOT NULL DEFAULT 'image',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `banners`
--

INSERT INTO `banners` (`id`, `title_ku`, `title_ar`, `title_en`, `image_url`, `video_url`, `type`, `is_active`, `sort_order`, `created_at`, `updated_at`) VALUES
('7bdb7fee-ab97-11f0-b9f9-a30f62be92a0', 'video', 'video', 'video', '/api/cloud/files/16257842-6eeb-463c-9ba3-c1abf02ebabf', '/api/cloud/files/16257842-6eeb-463c-9ba3-c1abf02ebabf', 'video', 1, 0, '2025-10-17 20:25:55', '2025-10-17 20:25:55'),
('8da43bfc-b17e-11f0-b1f4-171420638fa7', 'بەرنامەیەکی نوێ', 'برنامج جديد', 'New Program', '/image/2.jpg', '', 'image', 1, 1, '2025-10-25 08:42:34', '2025-10-25 08:42:34'),
('8da465e6-b17e-11f0-b1f4-171420638fa7', 'پڕۆژەی گەورە', 'مشروع كبير', 'Big Project', '/image/barham.jpg', '', 'image', 1, 2, '2025-10-25 08:42:34', '2025-10-25 08:42:34'),
('96c19c64-ac0d-11f0-aaa9-4de7a06b35ca', 'بەرنامەیەکی نوێ', 'برنامج جديد', 'New Program', '/image/2.jpg', '', 'image', 1, 1, '2025-10-18 10:31:21', '2025-10-18 10:31:21'),
('96c1bc94-ac0d-11f0-aaa9-4de7a06b35ca', 'پڕۆژەی گەورە', 'مشروع كبير', 'Big Project', '/image/barham.jpg', '', 'image', 1, 2, '2025-10-18 10:31:21', '2025-10-18 10:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `title_ku` varchar(150) NOT NULL,
  `title_ar` varchar(150) NOT NULL,
  `title_en` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `countries`
--

CREATE TABLE `countries` (
  `id` int(11) NOT NULL,
  `name_ku` varchar(255) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `code` varchar(3) DEFAULT NULL COMMENT 'ISO 3166-1 alpha-3 country code',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `countries`
--

INSERT INTO `countries` (`id`, `name_ku`, `name_ar`, `name_en`, `code`, `created_at`, `updated_at`) VALUES
(1, 'عێراق', 'العراق', 'Iraq', 'IRQ', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(2, 'تورکیا', 'تركيا', 'Turkey', 'TUR', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(3, 'ئێران', 'إيران', 'Iran', 'IRN', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(4, 'سوریا', 'سوريا', 'Syria', 'SYR', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(5, 'وڵاتە یەکگرتووەکانی ئەمەریکا', 'الولايات المتحدة الأمريكية', 'United States', 'USA', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(6, 'شانشینی یەکگرتوو', 'المملكة المتحدة', 'United Kingdom', 'GBR', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(7, 'ئەڵمانیا', 'ألمانيا', 'Germany', 'DEU', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(8, 'فەرەنسا', 'فرنسا', 'France', 'FRA', '2025-10-20 07:18:18', '2025-10-20 07:18:18');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` varchar(36) NOT NULL ,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `image_url`) VALUES
('13D07535-C59E-4157-A011-F8D2EF4E0CBB', 'Balazs Orban', 'balazs@orban.com', '/customers/balazs-orban.png'),
('3958dc9e-712f-4377-85e9-fec4b6a6442a', 'Delba de Oliveira', 'delba@oliveira.com', '/customers/delba-de-oliveira.png'),
('3958dc9e-742f-4377-85e9-fec4b6a6442a', 'Lee Robinson', 'lee@robinson.com', '/customers/lee-robinson.png'),
('76d65c26-f784-44a2-ac19-586678f7c2f2', 'Michael Novotny', 'michael@novotny.com', '/customers/michael-novotny.png'),
('CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 'Amy Burns', 'amy@burns.com', '/customers/amy-burns.png'),
('d6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 'Evil Rabbit', 'evil@rabbit.com', '/customers/evil-rabbit.png');

-- --------------------------------------------------------

--
-- Table structure for table `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `title_ku` varchar(155) NOT NULL,
  `title_ar` varchar(155) NOT NULL,
  `title_en` varchar(155) NOT NULL,
  `description_ku` text NOT NULL,
  `description_ar` text NOT NULL,
  `description_en` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event`
--

INSERT INTO `event` (`id`, `title_ku`, `title_ar`, `title_en`, `description_ku`, `description_ar`, `description_en`, `created_at`) VALUES
(6, 'یادی شاری سلێمانی پیرۆز بێت ', 'يوم السليمانية السعيد', 'Happy Sulaimani Day', 'شاری سلێمانی ٢٤٠ ساڵ لەمەوبەر لە ١٤ تشرینی دووەمی ساڵی ١٧٨٤ لەلایەن ئیبراهیم پاشای بابانەوە دامەزراوە و بە ناوی سلێمان پاشای بابانەوە ناونراوە،، شارەکە لەو کاتەدا پایتەختی مرنشینی بابان بووە...', 'تأسست مدينة السليمانية قبل 240 عاما في 14 نوفمبر 1784 على يد إبراهيم باشا بابان وسميت على اسم سليمان باشا بابان ، وكانت المدينة عاصمة بابان في ذلك الوقت', 'The city of Sulaymaniyah was founded 240 years ago on November 14, 1784 by Ibrahim Pasha Baban and was named after Suleiman Pasha Baban. The city was the capital of Baban at that time.', '2025-10-20 20:45:09'),
(7, 'زیندووکردنەوە و ڕەسەنایەتی کەلتوور', 'إحياء الثقافة وأصالتها', 'Revitalization and authenticity of culture', '‎یەکێک لەو بنەما گرنگانەی کە دامەزراوەی ئەندازیاری ڤالیو ئارکیتێکتس کاری لەسەر کرد لەسەرەتاوە بریتی بوو لە:-زیندووکردنەوەو لەبەرچاووگرتنی ڕەسەنایەتی کەلتوور ,لە دنیای سەرمایەداریدا ، هەربۆیە بەردەوام جەخت لەسەر ئەم ڕێڕەوە دەکاتەوە، هەماهەنگی و داوای پشگیری ئەو کەسانە دەکات کە بەهای ڕەسەنایەتی و کەلتوور دەزانن\r\n‎ بۆ ڕووناکردنەوەی ئەم ئامانجەش بە خێرهاتنی پارێزگاری سلێمانی (دکتۆر هەڤاڵ ابوبکر) مان کرد، ڕاوبۆچوون و گفتوگۆکرا، سەبارەت بە پرۆژە دەستپێشخەریەکانی دامەزراوەی ئەندازیاری ڤالیو، بۆ شاری سلێمانی، بۆ زیندووکردنەوە و ئاوێتەکردنی کەلتوور لەگەڵ دونیای نوێگەریدا، بەهەمان شێوە چەمکی بەردەوامی و لایەنی ژینگەیی.\r\n‎وەرگرتنی سەرنج و تێبینی و ڕەخنەکان لەلایەن بەڕێزیانەوە، لە هەمان کات پشتگیریکردنێکی تەواو بەهێزی پارێزگاری سلێمانی ئەم ئامانجەی ڤالیوی زۆر نزیکتر کردەوە.\r\n‎دەستخۆشی لە بەڕێزیان دەکەین، و هیوادارین هەموو پێکەوە کار بۆ سلێمانی’ەکی پێشکەوتووترو بنیادنانی شارێک لەسەر بنەماکانی پلانسازی و  شارسازی ئەو ئامانجانەی سەرەتا سلێمانی لەسەر بنیادنرا.', 'من أهم المبادئ التي عملت عليها شركة Value Architects منذ البداية: - إحياء الثقافة ومراعاة أصالة الثقافة في العالم الرأسمالي، لذا فهي تؤكد باستمرار على هذا المسار والتنسيق، وتسعى إلى دعم أولئك الذين يعرفون قيمة الأصالة والثقافة. ولتوضيح هذا الهدف، استقبلنا محافظ السليمانية (الدكتور هفال أبو بكر) وناقشنا مبادرات معهد هندسة القيمة في السليمانية، لإحياء الثقافة ودمجها مع عالم الحداثة، بالإضافة إلى مفهوم الاستدامة والجوانب البيئية.\r\n\r\nوقد ساهمت التعليقات والانتقادات التي تلقيناها منه، بالإضافة إلى الدعم القوي من محافظ السليمانية، في تقريب Value بشكل كبير من هذا الهدف.\r\n\r\nنهنئه، ونأمل أن نعمل معًا من أجل سليمانية أكثر تطورًا وبناء مدينة قائمة على مبادئ التخطيط والتحضر، وهي الأهداف التي بُنيت عليها السليمانية في الأصل.', 'One of the important principles that Value Architects worked on from the beginning was: - Reviving and taking into account the authenticity of culture, in the capitalist world, therefore constantly emphasizes this path, coordination and seeks the support of those who know the value of authenticity and culture\r\nTo explain this goal, we welcomed the Governor of Sulaimani (Dr. Haval Abubakr) and discussed the initiatives of Value Engineering Institute for Sulaimani, to revive and blend culture with the world of modernity, as well as the concept of sustainability and environmental aspects.\r\nReceiving comments and criticisms from him, as well as the strong support of the Governor of Sulaimani, brought Value much closer to this goal.\r\nWe congratulate him, and hope that we will work together for a more developed Sulaymaniyah and build a city based on the principles of planning and urbanization, the goals on which Sulaymaniyah was originally built.', '2025-10-20 21:30:15');

-- --------------------------------------------------------

--
-- Table structure for table `footer_properties`
--

CREATE TABLE `footer_properties` (
  `id` int(11) NOT NULL,
  `property_key` varchar(100) NOT NULL,
  `title_en` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_ku` varchar(255) NOT NULL,
  `content_en` text NOT NULL,
  `content_ar` text NOT NULL,
  `content_ku` text NOT NULL,
  `property_type` enum('about','stats','contact','social') NOT NULL DEFAULT 'about',
  `display_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `footer_properties`
--

INSERT INTO `footer_properties` (`id`, `property_key`, `title_en`, `title_ar`, `title_ku`, `content_en`, `content_ar`, `content_ku`, `property_type`, `display_order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'company_about', 'About Value Architects', 'حول شركة فاليو للمعمار', 'دەربارەی ڤالیو ئارکیتێکتس', 'Established in 2020, our engineering office in Sulaymaniyah, Kurdistan Region of Iraq, is registered with the Kurdistan Engineering Union (KEU) under number 308. Our firm specializes in designing, implementing, and supervising a wide range of engineering projects.', 'تأسس مكتبنا الهندسي في السليمانية، إقليم كردستان العراق عام 2020، ومسجل لدى نقابة المهندسين الكردستانية تحت الرقم 308. تختص شركتنا في تصميم وتنفيذ والإشراف على مجموعة واسعة من المشاريع الهندسية.', 'نووسینگەی ئەندازیاریمان لە ساڵی ٢٠٢٠ لە سلێمانی، هەرێمی کوردستانی عێراق دامەزراوە و لە ژێر ژمارە ٣٠٨ لە یەکێتیی ئەندازیارانی کوردستان تۆمارکراوە. کۆمپانیاکەمان پسپۆڕە لە دیزاین و جێبەجێکردن و سەرپەرشتیکردنی کۆمەڵێک پڕۆژەی ئەندازیاری.', 'about', 1, 1, '2025-10-25 08:42:34', '2025-10-25 08:42:34'),
(2, 'company_mission', 'Our Mission', 'مهمتنا', 'ئامانجەکانمان', 'With a dedicated team comprising architects, civil, mechanical, and electrical engineers, we are committed to delivering innovative and effective solutions tailored to our clients needs.', 'مع فريق متخصص يضم مهندسين معماريين ومدنيين وميكانيكيين وكهربائيين، نحن ملتزمون بتقديم حلول مبتكرة وفعالة مصممة خصيصاً لاحتياجات عملائنا.', 'لەگەڵ تیمێکی تایبەت کە پێکهاتووە لە ئەندازیارانی بیناسازی، مەدەنی، مەکانیکی و کارەبایی، ئێمە پابەندین بە پێشکەشکردنی چارەسەری داهێنەرانە و کاریگەر کە بە پێی پێداویستیەکانی کڕیارەکانمان دیزاین کراون.', 'about', 2, 1, '2025-10-25 08:42:34', '2025-10-25 08:42:34');

-- --------------------------------------------------------

--
-- Table structure for table `galleries`
--

CREATE TABLE `galleries` (
  `id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `parent_type` enum('0','1','2') NOT NULL COMMENT '0=project\r\n1=event\r\n2=product\r\n\r\n',
  `image_url` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `order_index` int(11) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `galleries`
--

INSERT INTO `galleries` (`id`, `parent_id`, `parent_type`, `image_url`, `alt_text`, `order_index`, `created_at`) VALUES
(538, 6, '1', '/api/cloud/files/782e648f-0bc0-474e-8e6d-b14aa05601b4', '491929354_1227987935997463_5806340608454776516_n', 1, '2025-10-28 00:06:32'),
(586, 2, '2', '/api/cloud/files/22243f3b-e59a-46ed-9bb7-5b1c8cb59898', 'beautiful-shot-stylish-grey-chair-isolated-white-background', 1, '2025-10-28 00:09:17'),
(592, 7, '1', '/api/cloud/files/60035866-65c6-40cd-85b3-7b41af30d34a', '506170982_1291174062368081_7791171834853838380_n', 1, '2025-10-28 22:26:34'),
(593, 7, '1', '/api/cloud/files/ad1724a9-800c-4c25-934b-e76edf26ef5d', '506533490_1291174059034748_7797768563551843847_n', 2, '2025-10-28 22:26:34'),
(594, 7, '1', '/api/cloud/files/58b3dff0-affc-44a8-b099-5ead761a7148', '506612844_1291174065701414_4135960142342438919_n', 3, '2025-10-28 22:26:34'),
(595, 7, '1', '/api/cloud/files/63056baa-8b7e-4e27-a1c2-819c93df4fc1', '506620781_1291174069034747_2601880888003813789_n', 4, '2025-10-28 22:26:34'),
(596, 7, '1', '/api/cloud/files/0d7d088b-7b69-4279-8a75-98d2128705e6', '506627927_1291174045701416_1530790524501410362_n', 5, '2025-10-28 22:26:34'),
(774, 25, '0', '/api/cloud/files/45bc76e8-bfa4-40a7-bd45-2611909670ce', '2', 1, '2025-11-04 08:35:52'),
(775, 25, '0', '/api/cloud/files/05af14f1-6386-4318-8102-0502a335e55e', '3', 2, '2025-11-04 08:35:52'),
(776, 25, '0', '/api/cloud/files/200a7e72-4ce6-4de9-99c7-11e1edc4f8e0', '4', 3, '2025-11-04 08:35:52'),
(777, 25, '0', '/api/cloud/files/872f3b11-a681-4484-8c2d-a5112b5cc483', '5', 4, '2025-11-04 08:35:52'),
(778, 25, '0', '/api/cloud/files/f0bb7393-ae98-4532-a0dc-e12a346e54e5', '6', 5, '2025-11-04 08:35:52'),
(779, 25, '0', '/api/cloud/files/dfd8f21c-1cfc-4124-b411-fb69004ba277', '7', 6, '2025-11-04 08:35:52'),
(780, 25, '0', '/api/cloud/files/138abbd7-4fb1-40e3-a426-a801cdb87973', '9', 7, '2025-11-04 08:35:52'),
(781, 25, '0', '/api/cloud/files/d959ec43-314b-48fb-a266-0757dcc8d4b0', '10', 8, '2025-11-04 08:35:52'),
(829, 17, '0', '/api/cloud/files/daae0056-4fc7-4c9b-b843-1c51c11fd6d3', 'ex65 (1)', 1, '2025-11-04 08:41:55'),
(830, 17, '0', '/api/cloud/files/4faba667-e5d1-4510-9fbb-81faad53284a', 'ex65 (5)', 2, '2025-11-04 08:41:55'),
(831, 17, '0', '/api/cloud/files/e9917427-b928-476d-b78b-ed9b73f45f4a', 'p0', 3, '2025-11-04 08:41:55'),
(832, 17, '0', '/api/cloud/files/f08c5f58-2742-42ad-a36f-11801c043f66', 'p1', 4, '2025-11-04 08:41:55'),
(833, 17, '0', '/api/cloud/files/565af7e7-5dd3-4477-b3f4-8f08853bb524', 'p2', 5, '2025-11-04 08:41:55'),
(834, 17, '0', '/api/cloud/files/27739fbf-b739-4a6b-a47a-759b14586536', 'p4', 6, '2025-11-04 08:41:55'),
(835, 17, '0', '/api/cloud/files/7955f5d5-cabe-4e35-a40e-a69c1ee1352c', 'p5', 7, '2025-11-04 08:41:55'),
(929, 13, '0', '/api/cloud/files/79da123d-8131-4bdc-a665-b8993d01d0e0', 'VP02-madinat alahlam(23-7-2025_compressed_page-0006', 1, '2025-11-04 09:25:18'),
(930, 13, '0', '/api/cloud/files/6e486874-ed34-4287-a669-7845ed2f2989', 'VP02-madinat alahlam(23-7-2025_compressed_page-0007', 2, '2025-11-04 09:25:18'),
(931, 13, '0', '/api/cloud/files/00aa43df-d94c-4d9a-b9af-880cc21277ec', 'VP02-madinat alahlam(23-7-2025_compressed_page-0008', 3, '2025-11-04 09:25:18'),
(932, 13, '0', '/api/cloud/files/e2da66e3-9ef9-40db-bed1-1851eb91b308', 'VP02-madinat alahlam(23-7-2025_compressed_page-0009', 4, '2025-11-04 09:25:18'),
(933, 13, '0', '/api/cloud/files/ff5ff586-40df-4c7d-bcc3-12b59bb27c3c', 'VP02-madinat alahlam(23-7-2025_compressed_page-0010', 5, '2025-11-04 09:25:18'),
(934, 13, '0', '/api/cloud/files/7503fe74-d087-4a0f-86fa-143f8f1a21f3', 'VP02-madinat alahlam(23-7-2025_compressed_page-0011', 6, '2025-11-04 09:25:18'),
(935, 13, '0', '/api/cloud/files/a002c90e-8575-4c78-a0ae-737ab060f5a5', 'VP02-madinat alahlam(23-7-2025_compressed_page-0012', 7, '2025-11-04 09:25:18'),
(936, 13, '0', '/api/cloud/files/61452648-b259-4cbd-be68-47c8335991d7', 'VP02-madinat alahlam(23-7-2025_compressed_page-0014', 8, '2025-11-04 09:25:18'),
(937, 13, '0', '/api/cloud/files/69352813-bbe0-47d7-8674-eb36e443d43a', 'VP02-madinat alahlam(23-7-2025_compressed_page-0015', 9, '2025-11-04 09:25:18'),
(938, 13, '0', '/api/cloud/files/e89264d7-817a-4847-87b1-a4e379af574b', 'VP02-madinat alahlam(23-7-2025_compressed_page-0016', 10, '2025-11-04 09:25:18'),
(939, 13, '0', '/api/cloud/files/87396a25-694e-4f60-af1c-bcefac26ba5f', 'VP02-madinat alahlam(23-7-2025_compressed_page-0017', 11, '2025-11-04 09:25:18'),
(940, 13, '0', '/api/cloud/files/f2ddecd1-6db0-4125-8d29-1033d55c9828', 'VP02-madinat alahlam(23-7-2025_compressed_page-0018', 12, '2025-11-04 09:25:18'),
(941, 13, '0', '/api/cloud/files/e429a60c-a502-42ed-bb34-bab4d11453f8', 'VP02-madinat alahlam(23-7-2025_compressed_page-0019', 13, '2025-11-04 09:25:18'),
(942, 13, '0', '/api/cloud/files/884ddc53-cea7-41ed-a9a6-a854a4cfef01', 'VP02-madinat alahlam(23-7-2025_compressed_page-0020', 14, '2025-11-04 09:25:18'),
(943, 13, '0', '/api/cloud/files/8b7b71a4-ac23-4011-8b4d-a06c2f1bf126', 'VP02-madinat alahlam(23-7-2025_compressed_page-0021', 15, '2025-11-04 09:25:18'),
(944, 13, '0', '/api/cloud/files/92ffb612-80cd-4d6d-a24e-eaeaff044644', 'VP02-madinat alahlam(23-7-2025_compressed_page-0022', 16, '2025-11-04 09:25:18'),
(945, 13, '0', '/api/cloud/files/09f1abee-5709-4f7c-bcec-266749703172', 'VP02-madinat alahlam(23-7-2025_compressed_page-0024', 17, '2025-11-04 09:25:18'),
(946, 13, '0', '/api/cloud/files/31e35076-cf67-4510-a905-7acecc4240c5', 'VP02-madinat alahlam(23-7-2025_compressed_page-0025', 18, '2025-11-04 09:25:18'),
(947, 13, '0', '/api/cloud/files/79ee4428-ce48-46dc-bd8c-099e43a87166', 'VP02-madinat alahlam(23-7-2025_compressed_page-0026', 19, '2025-11-04 09:25:18'),
(948, 13, '0', '/api/cloud/files/171a3005-e177-4760-86c8-e7321b8ac693', 'VP02-madinat alahlam(23-7-2025_compressed_page-0027', 20, '2025-11-04 09:25:18'),
(949, 13, '0', '/api/cloud/files/57440b19-a27a-467f-b5db-f5a9b96c77c6', 'VP02-madinat alahlam(23-7-2025_compressed_page-0028', 21, '2025-11-04 09:25:18'),
(950, 13, '0', '/api/cloud/files/34b84d51-1af6-472a-bae2-8a93e7074380', 'VP02-madinat alahlam(23-7-2025_compressed_page-0029', 22, '2025-11-04 09:25:18'),
(951, 13, '0', '/api/cloud/files/4164bb6e-ee66-4dfb-a0b3-40ca0fa191b0', 'VP02-madinat alahlam(23-7-2025_compressed_page-0030', 23, '2025-11-04 09:25:18'),
(952, 13, '0', '/api/cloud/files/3bb3606b-b5e0-4a58-b8dd-12189adf604e', 'VP02-madinat alahlam(23-7-2025_compressed_page-0031', 24, '2025-11-04 09:25:18'),
(953, 13, '0', '/api/cloud/files/eacdac94-44d9-4dc4-a759-ec6c9bbdee0b', 'VP02-madinat alahlam(23-7-2025_compressed_page-0032', 25, '2025-11-04 09:25:18'),
(954, 13, '0', '/api/cloud/files/ac053db8-dc32-4a7f-8c6c-d1352b8fd916', 'VP02-madinat alahlam(23-7-2025_compressed_page-0033', 26, '2025-11-04 09:25:18'),
(955, 13, '0', '/api/cloud/files/5fa79aef-7486-47fd-b463-8fb41a8d4e59', 'VP02-madinat alahlam(23-7-2025_compressed_page-0034', 27, '2025-11-04 09:25:18'),
(956, 13, '0', '/api/cloud/files/2b3898c3-42c7-4138-982d-7f486a95c0e9', 'VP02-madinat alahlam(23-7-2025_compressed_page-0035', 28, '2025-11-04 09:25:18'),
(957, 13, '0', '/api/cloud/files/f6e4f003-fb2d-4c29-b482-14457e563be8', 'VP02-madinat alahlam(23-7-2025_compressed_page-0036', 29, '2025-11-04 09:25:18'),
(958, 13, '0', '/api/cloud/files/c70a2a33-0d3b-4156-8d58-113fa06f259b', 'VP02-madinat alahlam(23-7-2025_compressed_page-0037', 30, '2025-11-04 09:25:18'),
(959, 13, '0', '/api/cloud/files/2ac7bbf1-0e50-4130-aa0d-80ab5606c15a', 'VP02-madinat alahlam(23-7-2025_compressed_page-0038', 31, '2025-11-04 09:25:18'),
(960, 13, '0', '/api/cloud/files/b649933e-78e2-4775-902c-a768f7b2f182', 'VP02-madinat alahlam(23-7-2025_compressed_page-0039', 32, '2025-11-04 09:25:18'),
(961, 13, '0', '/api/cloud/files/19335dd8-e493-4120-90e9-1e297fab35d8', 'VP02-madinat alahlam(23-7-2025_compressed_page-0040', 33, '2025-11-04 09:25:18'),
(962, 13, '0', '/api/cloud/files/5cb2d5b2-23dc-4097-805e-cfd19360d214', 'VP02-madinat alahlam(23-7-2025_compressed_page-0041', 34, '2025-11-04 09:25:18'),
(963, 13, '0', '/api/cloud/files/79d8441c-eaf2-44b0-8390-a635a09627c0', 'VP02-madinat alahlam(23-7-2025_compressed_page-0042', 35, '2025-11-04 09:25:18'),
(964, 13, '0', '/api/cloud/files/dde1f55f-ea3b-4e66-81f2-048e49eb526a', 'VP02-madinat alahlam(23-7-2025_compressed_page-0043', 36, '2025-11-04 09:25:18'),
(965, 13, '0', '/api/cloud/files/6f5be3e0-c90c-4f82-a872-c4f886941bc1', 'VP02-madinat alahlam(23-7-2025_compressed_page-0044', 37, '2025-11-04 09:25:18'),
(966, 13, '0', '/api/cloud/files/c04dd507-a068-429e-8f5b-f7693736723e', 'VP02-madinat alahlam(23-7-2025_compressed_page-0045', 38, '2025-11-04 09:25:18'),
(967, 13, '0', '/api/cloud/files/0ecfb09a-2996-4af6-822e-b16cdf2779c2', 'VP02-madinat alahlam(23-7-2025_compressed_page-0047', 39, '2025-11-04 09:25:18'),
(968, 13, '0', '/api/cloud/files/c95b79b3-4b2f-4d12-8c79-0a4a9e3af795', 'VP02-madinat alahlam(23-7-2025_compressed_page-0048', 40, '2025-11-04 09:25:18'),
(969, 13, '0', '/api/cloud/files/0f0beeb9-8a01-42b8-aa18-0aa95dc8e05c', 'VP02-madinat alahlam(23-7-2025_compressed_page-0049', 41, '2025-11-04 09:25:18'),
(970, 13, '0', '/api/cloud/files/ed38dd6b-43ca-4aa9-b92c-75fc3626c75a', 'VP02-madinat alahlam(23-7-2025_compressed_page-0050', 42, '2025-11-04 09:25:18'),
(971, 13, '0', '/api/cloud/files/4952f865-42ce-49c1-9b36-9f136a67a810', 'VP02-madinat alahlam(23-7-2025_compressed_page-0051', 43, '2025-11-04 09:25:18'),
(972, 13, '0', '/api/cloud/files/0d975189-f2dc-42ed-acd3-460b3532b51a', 'VP02-madinat alahlam(23-7-2025_compressed_page-0052', 44, '2025-11-04 09:25:18'),
(973, 13, '0', '/api/cloud/files/b0a2be10-b7ab-4df3-bc4a-e3f5830fbd8e', 'VP02-madinat alahlam(23-7-2025_compressed_page-0053', 45, '2025-11-04 09:25:18'),
(974, 13, '0', '/api/cloud/files/56f6f443-4cd4-470d-b266-acb82d40fdb2', 'VP02-madinat alahlam(23-7-2025_compressed_page-0055', 46, '2025-11-04 09:25:18'),
(975, 23, '0', '/api/cloud/files/5189e7b5-4e4e-4b6e-9834-5da7ead443bb', '1a', 1, '2025-11-04 09:31:45'),
(976, 23, '0', '/api/cloud/files/81f9c4b7-b4c2-4358-b254-b0398bc5726e', '9a', 2, '2025-11-04 09:31:45'),
(977, 23, '0', '/api/cloud/files/c09b395b-f03e-4b92-aa81-3f9088dc972c', '12a', 3, '2025-11-04 09:31:45'),
(978, 23, '0', '/api/cloud/files/cabbf610-02b6-4593-9418-e8828802a229', '13a', 4, '2025-11-04 09:31:45'),
(979, 23, '0', '/api/cloud/files/6da4ddb1-0ffa-4366-8405-34c101b0fd7a', '19a', 5, '2025-11-04 09:31:45'),
(980, 27, '0', '/api/cloud/files/f4984996-e957-4595-9093-ff7df4ddbf52', 'V1 (1)', 1, '2025-11-04 09:34:24'),
(981, 27, '0', '/api/cloud/files/5521c93e-93cb-4da4-b155-a7217097910a', 'V1 (2)', 2, '2025-11-04 09:34:24'),
(982, 27, '0', '/api/cloud/files/3f6c0f96-b8b9-43ff-a55e-34621ed5e2c0', 'V1 (3)', 3, '2025-11-04 09:34:24'),
(983, 27, '0', '/api/cloud/files/8a2bc3e9-e001-4948-b65f-da5094c3465d', 'V1 (4)', 4, '2025-11-04 09:34:24'),
(984, 27, '0', '/api/cloud/files/5eafa8ee-9a55-4841-83d6-e3233dce5ef8', 'V1 (5)', 5, '2025-11-04 09:34:24'),
(985, 27, '0', '/api/cloud/files/e38609ab-7f31-456e-9c5d-c89024da3ea3', 'V1 (6)', 6, '2025-11-04 09:34:24'),
(986, 27, '0', '/api/cloud/files/45133a24-cb02-45ba-88f5-4260973972fc', 'V1 (7)', 7, '2025-11-04 09:34:24'),
(987, 27, '0', '/api/cloud/files/5164bf3b-7958-4243-aff4-362a3b559dc7', 'V1 (8)', 8, '2025-11-04 09:34:24'),
(988, 27, '0', '/api/cloud/files/34cfa95d-1f8e-4b49-b6fa-013aa01d7e2a', 'V1 (9)', 9, '2025-11-04 09:34:24'),
(989, 27, '0', '/api/cloud/files/8b9fd435-ca68-4b31-85be-f43fc674fd52', 'V1 (10)', 10, '2025-11-04 09:34:24'),
(990, 27, '0', '/api/cloud/files/5eebac34-94bb-46c4-ae54-1cf6a941df33', 'V1 (12)', 11, '2025-11-04 09:34:24'),
(991, 24, '0', '/api/cloud/files/5b08c51a-f9a2-4423-89be-8523d169d94b', 'B (1)', 1, '2025-11-04 09:39:43'),
(992, 24, '0', '/api/cloud/files/90185025-d5cd-4559-96a8-371ad09469d3', 'B (2)', 2, '2025-11-04 09:39:43'),
(993, 24, '0', '/api/cloud/files/47e6ed2e-9c68-4119-997e-6de2b69edad1', 'B (3)', 3, '2025-11-04 09:39:43'),
(994, 24, '0', '/api/cloud/files/c7bcf9a2-e535-4a2a-bbc1-5cf4d8c81e38', 'guest room (3)', 4, '2025-11-04 09:39:43'),
(995, 24, '0', '/api/cloud/files/a9de0ff6-be40-4fe1-9baa-e9de212f4094', 'guest room (4)', 5, '2025-11-04 09:39:43'),
(996, 24, '0', '/api/cloud/files/996f72cd-698e-4ed0-b415-1f9efc465c4b', 'guest room (5)', 6, '2025-11-04 09:39:43'),
(997, 24, '0', '/api/cloud/files/932dab30-0f17-4c5e-b251-14e56b0da6ee', 'guest room (6)', 7, '2025-11-04 09:39:43'),
(998, 24, '0', '/api/cloud/files/c7c32ddc-e4f7-4fba-bf31-f16893bc6ab4', 'kitchen (1)', 8, '2025-11-04 09:39:43'),
(999, 24, '0', '/api/cloud/files/51610015-bfa3-4abc-b69c-4b4751fecf90', 'kitchen (3)', 9, '2025-11-04 09:39:43'),
(1000, 24, '0', '/api/cloud/files/d7d37a3c-79c3-4dae-a4ea-173f7ed4097c', 'kitchen (4)', 10, '2025-11-04 09:39:43'),
(1001, 24, '0', '/api/cloud/files/830aeba4-c206-4fe7-8eeb-9b63b5cfe80f', 'kitchen (5)', 11, '2025-11-04 09:39:43'),
(1002, 24, '0', '/api/cloud/files/32d23e46-82b4-4858-9b88-6898b9dc48d7', 'Z1 copy', 12, '2025-11-04 09:39:43'),
(1003, 19, '0', '/api/cloud/files/e8999e05-b9a0-4d0f-bd34-f84c14aadc25', '1 (1)', 1, '2025-11-04 09:45:14'),
(1004, 19, '0', '/api/cloud/files/ca80de75-0f37-4f08-a890-19f33ae9c27d', '1 (3)', 2, '2025-11-04 09:45:14'),
(1005, 19, '0', '/api/cloud/files/fa64b434-4fe8-45be-b3d2-6b8e3483eae9', '2 (1)', 3, '2025-11-04 09:45:14'),
(1006, 19, '0', '/api/cloud/files/f97e8c00-c888-47aa-8a96-9f5623968f48', '2 (2)', 4, '2025-11-04 09:45:14'),
(1007, 19, '0', '/api/cloud/files/854a3f23-3040-4ea4-912a-ecaab0111c00', '2 (3)', 5, '2025-11-04 09:45:14'),
(1008, 19, '0', '/api/cloud/files/5be1c3ef-9a12-4df4-8493-547884fa513b', '2 (4)', 6, '2025-11-04 09:45:14'),
(1009, 19, '0', '/api/cloud/files/995dffe4-dcb7-479c-abe4-5940c130aaf0', '2 (5)', 7, '2025-11-04 09:45:14'),
(1010, 19, '0', '/api/cloud/files/3dee605b-d9f0-4dab-8356-c62308bb4d2a', '2 (6)', 8, '2025-11-04 09:45:14'),
(1011, 19, '0', '/api/cloud/files/1af1de2a-aecb-43e8-9523-92549be78d95', 'IMG_9516', 9, '2025-11-04 09:45:14'),
(1012, 19, '0', '/api/cloud/files/5d39ee2a-2689-4988-ac45-b81bdacfd216', 'IMG_9517', 10, '2025-11-04 09:45:14'),
(1013, 19, '0', '/api/cloud/files/77a92344-e30c-4a1d-9928-4801f5f51401', 'IMG_9518', 11, '2025-11-04 09:45:14'),
(1014, 19, '0', '/api/cloud/files/06fc3f1d-7ec2-42fe-b730-434ac08c77a0', 'IMG_9520', 12, '2025-11-04 09:45:14'),
(1015, 19, '0', '/api/cloud/files/085ad05d-f640-4151-9bf4-c7fc916aafb3', 'IMG_9521', 13, '2025-11-04 09:45:14'),
(1016, 26, '0', '/api/cloud/files/debbcc05-f96c-43e5-b69d-42f058c19a47', 'g1 copy', 1, '2025-11-04 09:49:24'),
(1017, 26, '0', '/api/cloud/files/7edadc57-d5ee-427f-bf06-5a0fe30dcd2f', 'G3 copy', 2, '2025-11-04 09:49:24'),
(1018, 26, '0', '/api/cloud/files/681e3656-5b93-470f-8acc-b6548b62e16b', 'G6 copy', 3, '2025-11-04 09:49:24'),
(1019, 26, '0', '/api/cloud/files/67f64200-fe2e-404e-9aab-c388002c4291', 'G8 copy', 4, '2025-11-04 09:49:24'),
(1020, 26, '0', '/api/cloud/files/73186141-21ef-4690-94b7-fed8bef6327f', 'S1 copy', 5, '2025-11-04 09:49:24'),
(1021, 26, '0', '/api/cloud/files/19345ed5-07e5-4a60-9d3e-25c5906c0b09', 'S2 copy', 6, '2025-11-04 09:49:24'),
(1022, 26, '0', '/api/cloud/files/4ed4a199-eb45-4614-8c7f-e1eddb8f0944', 'z1 copy', 7, '2025-11-04 09:49:24'),
(1023, 26, '0', '/api/cloud/files/c0d98b84-8316-4843-abbb-1df8e383f98a', 'z4 copy', 8, '2025-11-04 09:49:24'),
(1024, 22, '0', '/api/cloud/files/0618cbf2-5305-42ef-8a6c-bbaa58f29445', 'bed1', 1, '2025-11-04 09:52:39'),
(1025, 22, '0', '/api/cloud/files/08514243-f4c9-4b79-8641-3b5333155ff9', 'bed2', 2, '2025-11-04 09:52:39'),
(1026, 22, '0', '/api/cloud/files/41277d6a-7846-4ff0-81d8-ebeb8e19e276', 'bed3', 3, '2025-11-04 09:52:39'),
(1027, 22, '0', '/api/cloud/files/592c48e1-38eb-4fcf-a8a3-2feb83fbef7a', 'G1', 4, '2025-11-04 09:52:39'),
(1028, 22, '0', '/api/cloud/files/3b09097d-c6fa-4307-a52f-3bce06a4e2d4', 'G2', 5, '2025-11-04 09:52:39'),
(1029, 22, '0', '/api/cloud/files/88233fff-317f-4acc-b1f3-08d51bbff317', 'G3', 6, '2025-11-04 09:52:39'),
(1030, 22, '0', '/api/cloud/files/f16d102b-bb73-43e8-8778-4bf2efef4d2e', 'G4', 7, '2025-11-04 09:52:39'),
(1031, 22, '0', '/api/cloud/files/1df42a51-30f4-45be-85dd-48003a2cd96b', 'G5', 8, '2025-11-04 09:52:39'),
(1032, 22, '0', '/api/cloud/files/799178b1-7f45-429f-9505-7c46b2417045', 'G6', 9, '2025-11-04 09:52:39'),
(1033, 22, '0', '/api/cloud/files/a2f0603b-5870-4048-b387-76cb71ffb6d4', 'HOT KITCHEN', 10, '2025-11-04 09:52:39'),
(1034, 22, '0', '/api/cloud/files/520f2c42-796b-4546-a125-80b1e6eaddc5', 'k2', 11, '2025-11-04 09:52:39'),
(1035, 22, '0', '/api/cloud/files/03ba46e6-7aca-4f01-82e3-ba984483f180', 'k3', 12, '2025-11-04 09:52:39'),
(1036, 22, '0', '/api/cloud/files/806e096a-1773-4f03-b4b8-84e0381f862a', 'k4', 13, '2025-11-04 09:52:39'),
(1037, 22, '0', '/api/cloud/files/9c8136f6-83a2-4464-9f16-f22e6d1d86bd', 'L1', 14, '2025-11-04 09:52:39'),
(1038, 22, '0', '/api/cloud/files/ef4a9e5f-d0b4-42fb-b43f-02f6d05eb94a', 'L3', 15, '2025-11-04 09:52:39'),
(1039, 22, '0', '/api/cloud/files/03d336b4-3452-4a5a-af61-87c3a743635e', 'M BED1', 16, '2025-11-04 09:52:39'),
(1040, 22, '0', '/api/cloud/files/663bba5c-0354-4fc0-985c-be76abd99136', 'M BED3', 17, '2025-11-04 09:52:39'),
(1041, 22, '0', '/api/cloud/files/d5fe19f5-0cfc-41fc-aa18-eb10a9e8f338', 'M BED4', 18, '2025-11-04 09:52:39'),
(1042, 22, '0', '/api/cloud/files/a92bd204-a9f8-4b32-b53e-bbb8bcad40d6', 'm3', 19, '2025-11-04 09:52:39'),
(1043, 22, '0', '/api/cloud/files/1c90d6c0-311d-4f07-9a77-e47dab6b34aa', 'MADXAL2', 20, '2025-11-04 09:52:39'),
(1044, 22, '0', '/api/cloud/files/f09e98a8-5007-476e-85cc-666049d55461', 'photo_2022-07-13_15-19-38', 21, '2025-11-04 09:52:39'),
(1045, 22, '0', '/api/cloud/files/29ca40e6-fda7-4803-9238-ef3e6cdecc25', 'wwc1', 22, '2025-11-04 09:52:39'),
(1046, 22, '0', '/api/cloud/files/5f078ea9-e011-4129-aed9-ce4f10553928', 'wwc2', 23, '2025-11-04 09:52:39'),
(1047, 22, '0', '/api/cloud/files/bd5a67c8-0973-45e2-bebb-f820d9a45285', 'wwc3', 24, '2025-11-04 09:52:39'),
(1052, 18, '0', '/api/cloud/files/8ae6f6c2-faae-4018-a129-2caa016037c8', '1 (1)', 1, '2025-11-04 09:56:41'),
(1053, 18, '0', '/api/cloud/files/08fc071f-6de5-4d5f-a7cf-25f71f03bd9d', '1 (2)', 2, '2025-11-04 09:56:41'),
(1054, 18, '0', '/api/cloud/files/5b0f1c9a-00e5-4045-a762-a1acae9a01a9', '1 (3)', 3, '2025-11-04 09:56:41'),
(1055, 18, '0', '/api/cloud/files/3880da5b-b782-4a25-9e58-f63e2f7ff4ca', '1 (4)', 4, '2025-11-04 09:56:41'),
(1056, 21, '0', '/api/cloud/files/2d40bb8b-7b56-422d-b7cb-3539d398c3da', '1', 1, '2025-11-04 10:00:31'),
(1057, 21, '0', '/api/cloud/files/855f87e6-42bc-4f76-8a46-6c5da473b304', '2', 2, '2025-11-04 10:00:31'),
(1058, 21, '0', '/api/cloud/files/d9fabedf-214a-4bcb-a085-ef1a553a9d63', '3', 3, '2025-11-04 10:00:31'),
(1059, 21, '0', '/api/cloud/files/e90627f3-4d12-498e-a53e-8f359f71be48', '4', 4, '2025-11-04 10:00:31'),
(1060, 21, '0', '/api/cloud/files/02151a17-b27a-4d0f-a303-8b2af7a0dc2d', 'B.1 copy', 5, '2025-11-04 10:00:31'),
(1061, 21, '0', '/api/cloud/files/f159f9ad-4252-4b4a-9e01-9247373976b1', 'B.2 copy', 6, '2025-11-04 10:00:31'),
(1062, 21, '0', '/api/cloud/files/422aebeb-7913-4aca-9c45-f28823fbebc6', 'K.1 copy', 7, '2025-11-04 10:00:31'),
(1063, 21, '0', '/api/cloud/files/27dfd602-9eca-43d5-995a-5fcf287d1fb6', 'K.2 copy', 8, '2025-11-04 10:00:31'),
(1064, 20, '0', '/api/cloud/files/7720d5c8-e487-449c-9f15-48bc9e66cc65', 'ground floor (1)', 1, '2025-11-04 10:04:48'),
(1065, 20, '0', '/api/cloud/files/228614e7-cc1e-4eb0-97cc-62cfebaf8359', 'ground floor (2)', 2, '2025-11-04 10:04:48'),
(1066, 20, '0', '/api/cloud/files/22a040c0-c066-476b-97b1-e3a5fd202fa5', 'ground floor (3)', 3, '2025-11-04 10:04:48'),
(1067, 20, '0', '/api/cloud/files/0f9cd103-9e8a-4a85-963f-115520490c90', 'ground floor (4)', 4, '2025-11-04 10:04:48'),
(1068, 20, '0', '/api/cloud/files/2517c829-c055-4127-a5d7-f4181fc3e95e', 'ground floor (5)', 5, '2025-11-04 10:04:48'),
(1069, 20, '0', '/api/cloud/files/32f1e40a-5abc-422f-910e-23a066f911dd', 'ground floor (8)', 6, '2025-11-04 10:04:48'),
(1070, 20, '0', '/api/cloud/files/e3ff08ac-a86a-43b5-a149-34f8ba25f188', 'kitchen1', 7, '2025-11-04 10:04:48'),
(1071, 20, '0', '/api/cloud/files/5fee19a0-3aff-4ff6-9c37-08b782541446', 'kitchen2', 8, '2025-11-04 10:04:48'),
(1072, 28, '0', '/api/cloud/files/9d039b99-6cfa-4c9e-959e-5cc05dd06dc4', '1 Q2 copy (1)', 1, '2025-11-04 10:09:59'),
(1073, 28, '0', '/api/cloud/files/5e08bbb5-e427-46e0-9cf6-78807a734528', '1 Q2 copy (2)', 2, '2025-11-04 10:09:59'),
(1074, 28, '0', '/api/cloud/files/d86be28d-e4a0-4338-b69a-cff9aafd4db8', '1 Q2 copy (3)', 3, '2025-11-04 10:09:59'),
(1075, 28, '0', '/api/cloud/files/20faab75-75cb-4d00-933d-c2eb5ff72136', '1 Q2 copy (4)', 4, '2025-11-04 10:09:59'),
(1076, 28, '0', '/api/cloud/files/07086210-6a70-4c2d-b3f8-2d9e9b836ace', '1 Q2 copy (5)', 5, '2025-11-04 10:09:59'),
(1077, 28, '0', '/api/cloud/files/7a015af6-de0c-43aa-b56a-c2d4f54df615', '1 Q2 copy (6)', 6, '2025-11-04 10:09:59'),
(1078, 28, '0', '/api/cloud/files/d2eceefa-deee-4347-b086-a9166e78d46e', '1 Q2 copy (7)', 7, '2025-11-04 10:09:59'),
(1079, 28, '0', '/api/cloud/files/d75342d3-7f54-4e08-8edf-be610ff72df6', '1 Q2 copy (8)', 8, '2025-11-04 10:09:59'),
(1080, 28, '0', '/api/cloud/files/a163e430-f118-469f-8d02-aba60921af01', '1 Q2 copy (9)', 9, '2025-11-04 10:09:59'),
(1081, 28, '0', '/api/cloud/files/620bd0ba-e8f0-466b-8e72-2ad41167a96e', '1 Q2 copy (10)', 10, '2025-11-04 10:09:59'),
(1082, 28, '0', '/api/cloud/files/284f76c9-ebf8-498e-8955-ce34163c4cd4', '1 Q2 copy (11)', 11, '2025-11-04 10:09:59'),
(1083, 28, '0', '/api/cloud/files/c6dd649d-fb53-4dbb-b7c3-d68476e6dd18', '1 Q2 copy (12)', 12, '2025-11-04 10:09:59'),
(1084, 28, '0', '/api/cloud/files/fcc70567-e456-451c-a313-a0c67dca8997', '1 Q2 copy (13)', 13, '2025-11-04 10:09:59'),
(1085, 28, '0', '/api/cloud/files/72d5446b-1d09-4e6a-988a-4f865d70337f', '1 Q2 copy (14)', 14, '2025-11-04 10:09:59'),
(1086, 28, '0', '/api/cloud/files/dfac38a4-b316-479d-98e3-b432f534e025', '1 Q2 copy (15)', 15, '2025-11-04 10:09:59'),
(1087, 28, '0', '/api/cloud/files/a3939844-0228-4a6e-9cd4-c0defc17efec', '1 q7 copy', 16, '2025-11-04 10:09:59'),
(1088, 28, '0', '/api/cloud/files/38a53a6c-9f2b-4ee4-940e-8a5823b35cd0', '2 master bedroom (2)', 17, '2025-11-04 10:09:59'),
(1089, 28, '0', '/api/cloud/files/0b715b0c-b5f7-419c-9d15-5631050ee06e', '2 master bedroom (3)', 18, '2025-11-04 10:09:59'),
(1090, 28, '0', '/api/cloud/files/c30f609b-04b1-47c5-b981-baf6523b226d', '2 master bedroom (4)', 19, '2025-11-04 10:09:59'),
(1091, 28, '0', '/api/cloud/files/9069d751-ce96-4e35-b5e2-6618d1124e92', '2 master bedroom (5)', 20, '2025-11-04 10:09:59'),
(1092, 28, '0', '/api/cloud/files/1ea0d563-43ed-49c7-9384-c589d93a26fd', '3 boy1 copy (1)', 21, '2025-11-04 10:09:59'),
(1093, 28, '0', '/api/cloud/files/1bb5e902-7bed-4052-96af-e5e4b8ae9174', '3 boy1 copy (2)', 22, '2025-11-04 10:09:59'),
(1094, 28, '0', '/api/cloud/files/e11c6b8f-4d63-4782-8be5-0b6dd600e162', '3 boy1 copy (3)', 23, '2025-11-04 10:09:59'),
(1095, 28, '0', '/api/cloud/files/2b825a81-c1db-4c48-907a-985aad89df40', '3 boy1 copy (4)', 24, '2025-11-04 10:09:59'),
(1096, 28, '0', '/api/cloud/files/753e8e72-3232-4f16-a0eb-62b775b0b3d7', '3 boy1 copy (5)', 25, '2025-11-04 10:09:59'),
(1097, 28, '0', '/api/cloud/files/9fc954b7-7de7-449b-aed1-316f21496d6b', '4 girls bedroom (2)', 26, '2025-11-04 10:09:59'),
(1098, 28, '0', '/api/cloud/files/88e5d82c-fd5a-43e9-803d-d43c5b302fe2', '4 girls bedroom (3)', 27, '2025-11-04 10:09:59'),
(1099, 28, '0', '/api/cloud/files/c45bfb4b-15c1-438d-9949-a3895040b34d', '4 girls bedroom (4)', 28, '2025-11-04 10:09:59'),
(1100, 28, '0', '/api/cloud/files/177987bc-c88f-4b7f-8be2-206460aee364', '4 girls bedroom (5)', 29, '2025-11-04 10:09:59'),
(1101, 29, '0', '/api/cloud/files/d94f3675-83ef-4d6f-9c73-a924b0ce7415', '2a copy', 1, '2025-11-04 10:15:12'),
(1102, 29, '0', '/api/cloud/files/55802784-2db8-47c1-bc42-586b76fe0307', '2b copy', 2, '2025-11-04 10:15:12'),
(1103, 29, '0', '/api/cloud/files/bd768d2e-e640-49d5-9e23-b2dd46fec7fe', '3a copy', 3, '2025-11-04 10:15:12'),
(1104, 29, '0', '/api/cloud/files/81c8e19f-dba0-47a0-8585-bf67a3d61abf', '5a copy', 4, '2025-11-04 10:15:12'),
(1105, 29, '0', '/api/cloud/files/fec5e057-c22e-4bcc-a03a-7b28bf3b0ac6', '5b copy (2)', 5, '2025-11-04 10:15:12'),
(1106, 29, '0', '/api/cloud/files/2c883147-553f-4afc-81bf-f365a04607d3', '7a copy', 6, '2025-11-04 10:15:12'),
(1107, 29, '0', '/api/cloud/files/18d575f7-c74e-403f-b208-e8e0016dafa4', '8 copy (2)', 7, '2025-11-04 10:15:12'),
(1108, 29, '0', '/api/cloud/files/869c5ae5-96af-4864-a701-efbdc122fbd2', '9 copy', 8, '2025-11-04 10:15:12'),
(1109, 29, '0', '/api/cloud/files/1d425c4c-1efa-4dd2-80ef-c15d7fce1f41', '10 copy (2)', 9, '2025-11-04 10:15:12'),
(1110, 29, '0', '/api/cloud/files/93b3f2e0-72e6-47ee-89ed-be706475ec66', '11 (2)', 10, '2025-11-04 10:15:12'),
(1111, 29, '0', '/api/cloud/files/462e62e5-5a0e-494d-8762-a487b429c7bf', '11 copy', 11, '2025-11-04 10:15:12'),
(1112, 29, '0', '/api/cloud/files/48a094eb-3e0b-40f1-9e19-2aa19eb21a22', '13 copy (2)', 12, '2025-11-04 10:15:12'),
(1113, 29, '0', '/api/cloud/files/b437c26c-44b0-4098-a81e-ab4eb00a9eea', '14 copy (2)', 13, '2025-11-04 10:15:12'),
(1114, 29, '0', '/api/cloud/files/adaf89ac-2bed-4838-9de7-d4ab919942cf', '15 copy', 14, '2025-11-04 10:15:12'),
(1115, 29, '0', '/api/cloud/files/e04e3a34-7c35-4ac8-bf98-91a8a3a0c7a7', '16 copy (2)', 15, '2025-11-04 10:15:12'),
(1116, 29, '0', '/api/cloud/files/f19cea2c-63b7-40c6-a042-18b2dd23cf88', '18 copy (2)', 16, '2025-11-04 10:15:12'),
(1117, 29, '0', '/api/cloud/files/f15f206e-bead-4499-9a2d-272887269e54', '18 copy (3)', 17, '2025-11-04 10:15:12'),
(1118, 29, '0', '/api/cloud/files/b669d9cc-5d10-4caa-a50a-274601bee024', '20 copy', 18, '2025-11-04 10:15:12'),
(1119, 30, '0', '/api/cloud/files/a6cb52e8-62ad-4c27-9fa5-8ba29a8ec39c', 'F1', 1, '2025-11-04 10:22:05'),
(1120, 30, '0', '/api/cloud/files/dde8a14a-c848-4836-a559-d0a5ece06d40', 'F2', 2, '2025-11-04 10:22:05'),
(1121, 30, '0', '/api/cloud/files/1bcecf63-a805-4fe5-b30b-884799ec87d7', 'f3', 3, '2025-11-04 10:22:05'),
(1122, 30, '0', '/api/cloud/files/bee36e97-3538-4347-a723-aea9c16deaf1', 'f4', 4, '2025-11-04 10:22:05'),
(1123, 30, '0', '/api/cloud/files/74545bce-5d17-4b27-a5b4-8d60e2e8c113', 'f5', 5, '2025-11-04 10:22:05'),
(1124, 30, '0', '/api/cloud/files/d74cfe11-8f2a-4268-898c-c5717eb087d1', 'f6', 6, '2025-11-04 10:22:05'),
(1125, 30, '0', '/api/cloud/files/ce94e530-5e45-4068-be78-6640f7b262bd', 'f7', 7, '2025-11-04 10:22:05'),
(1126, 30, '0', '/api/cloud/files/fcd71841-cac5-47aa-8843-e35ee0870036', '1', 8, '2025-11-04 10:22:05'),
(1127, 30, '0', '/api/cloud/files/96df238f-4dbd-4c21-9fea-6123a1215c6d', '2', 9, '2025-11-04 10:22:05'),
(1128, 30, '0', '/api/cloud/files/c625661d-ccb9-4b55-b59a-e9d63d0da9c8', '3 (1)', 10, '2025-11-04 10:22:05'),
(1129, 30, '0', '/api/cloud/files/ab868311-a451-467a-be08-150459a235e3', '3 (2)', 11, '2025-11-04 10:22:05'),
(1130, 30, '0', '/api/cloud/files/21d46d2f-26a3-43e2-9691-27db6242ee53', '3 (3)', 12, '2025-11-04 10:22:05'),
(1131, 30, '0', '/api/cloud/files/86e943f4-0e5c-4fea-95aa-c6cc54befdf1', '3 (4)', 13, '2025-11-04 10:22:05'),
(1132, 30, '0', '/api/cloud/files/e4cc9628-537b-4a0c-ad99-ebef26013ece', '3 (5)', 14, '2025-11-04 10:22:05'),
(1133, 30, '0', '/api/cloud/files/371d7b19-2b27-487c-aff6-3e6b0fd5e49d', '3 (6)', 15, '2025-11-04 10:22:05'),
(1134, 30, '0', '/api/cloud/files/1a512698-e974-45d8-b60c-87b4e0e6b946', '4', 16, '2025-11-04 10:22:05'),
(1135, 30, '0', '/api/cloud/files/1c384af7-57aa-4a85-8b3d-ccc970a84cd8', '5', 17, '2025-11-04 10:22:05'),
(1136, 30, '0', '/api/cloud/files/b2ca25e7-1460-4d21-8d20-f7178b1799ae', 'a first render_Ps (1)', 18, '2025-11-04 10:22:05'),
(1137, 30, '0', '/api/cloud/files/c2ecb3fa-1e8c-4031-a494-397f83445f7e', 'bath zone male', 19, '2025-11-04 10:22:05'),
(1138, 30, '0', '/api/cloud/files/8033806b-48cc-4e50-b3e5-038989107779', 'cafe2', 20, '2025-11-04 10:22:05'),
(1139, 30, '0', '/api/cloud/files/b0800bc6-3150-4f4d-8de6-4863a1e51150', 'cafe3', 21, '2025-11-04 10:22:05'),
(1140, 30, '0', '/api/cloud/files/565a86be-87bf-4ccf-ad9c-a20ec8af75c4', 'office1', 22, '2025-11-04 10:22:05'),
(1141, 30, '0', '/api/cloud/files/fbd6bcff-585c-4fc7-a506-d461b795e7f7', '1b', 23, '2025-11-04 10:22:05'),
(1142, 30, '0', '/api/cloud/files/1a8b60bc-012a-4993-a7cd-275fc9189ddf', '2b', 24, '2025-11-04 10:22:05'),
(1143, 30, '0', '/api/cloud/files/9b20e5f1-dcca-44bb-858f-3cad750fee20', 'R1', 25, '2025-11-04 10:22:05'),
(1144, 30, '0', '/api/cloud/files/37570af4-8f8e-4426-a8fd-6bbb910f9ddd', 'R2', 26, '2025-11-04 10:22:05'),
(1145, 30, '0', '/api/cloud/files/e308a978-5273-4d63-9fa4-a904c90019e0', 'R3', 27, '2025-11-04 10:22:05'),
(1146, 30, '0', '/api/cloud/files/4dcd0a90-e406-4d1c-94b6-a7a0e3bc4e13', 'R4', 28, '2025-11-04 10:22:05'),
(1147, 30, '0', '/api/cloud/files/67937748-e5e7-4e04-ad36-ba6e5b6c81e3', 'L1', 29, '2025-11-04 10:22:05'),
(1148, 30, '0', '/api/cloud/files/e712b36e-bf79-4d7e-8035-6c26af5543d1', 'L2', 30, '2025-11-04 10:22:05'),
(1149, 30, '0', '/api/cloud/files/ff7ed9cb-8455-47d5-8567-1242bfe7c707', 'lock1', 31, '2025-11-04 10:22:05'),
(1158, 32, '0', '/api/cloud/files/3581a327-0e8a-4555-868f-6393f20ef354', 'z0', 1, '2025-11-04 10:47:59'),
(1159, 32, '0', '/api/cloud/files/91c6a7b2-812f-41fd-91d1-7d19ae277124', 'z5 copy', 2, '2025-11-04 10:47:59'),
(1160, 32, '0', '/api/cloud/files/1b18316d-1bb0-42e9-a885-599900d44338', 'z6 copy', 3, '2025-11-04 10:47:59'),
(1161, 32, '0', '/api/cloud/files/71e7bfa7-0fae-44fd-aaed-2f66bef0fe01', 'z8copy', 4, '2025-11-04 10:47:59'),
(1162, 33, '0', '/api/cloud/files/521f9b99-a170-44d0-ae21-299fe3e002cb', 'A2 copy 2', 1, '2025-11-04 10:53:20'),
(1163, 33, '0', '/api/cloud/files/99276ca4-5203-48f5-8406-c7a888110fef', 'a3', 2, '2025-11-04 10:53:20'),
(1164, 33, '0', '/api/cloud/files/7b8b4a7a-66c4-4df2-a1f6-88d7579d676a', 'A4 copy 2', 3, '2025-11-04 10:53:20'),
(1165, 33, '0', '/api/cloud/files/5b3620de-1627-4c50-bfd9-898cdc262a64', 'A6 copy 2', 4, '2025-11-04 10:53:20'),
(1166, 34, '0', '/api/cloud/files/ff36e7a5-0585-4115-9792-89170a633f47', 'photo_2024-12-01_15-42-08', 1, '2025-11-04 10:57:54'),
(1167, 34, '0', '/api/cloud/files/a459c491-24c9-41df-9bdb-acc52354aa9b', 'photo_2024-12-01_15-42-09 (2)', 2, '2025-11-04 10:57:54'),
(1168, 34, '0', '/api/cloud/files/8c6e4c93-2162-43d2-a9d4-81efbd726a55', 'photo_2024-12-01_15-42-09', 3, '2025-11-04 10:57:54'),
(1169, 35, '0', '/api/cloud/files/07924c73-a7a6-47cd-9731-d6dfdf1ac501', '1 (1)', 1, '2025-11-04 11:00:35'),
(1170, 35, '0', '/api/cloud/files/57dac14c-aae3-4da7-a19a-765320275f73', '1 (3)', 2, '2025-11-04 11:00:35'),
(1171, 35, '0', '/api/cloud/files/2f680ffa-735e-496b-b3ec-cdd9be01fc16', '2 (2)', 3, '2025-11-04 11:00:35'),
(1172, 35, '0', '/api/cloud/files/243cda61-5c9c-471d-bb51-56942a8c0083', '3 (1)', 4, '2025-11-04 11:00:35'),
(1173, 35, '0', '/api/cloud/files/9eec934c-c120-462f-8cf5-3a9b96bf2c85', '3 (2)', 5, '2025-11-04 11:00:35'),
(1174, 35, '0', '/api/cloud/files/b6edf84b-35f4-45c5-a9e6-7447b69969f7', '4 (1)', 6, '2025-11-04 11:00:35'),
(1175, 35, '0', '/api/cloud/files/26cffd33-d049-4883-a3de-ad3087837da2', '5', 7, '2025-11-04 11:00:35'),
(1176, 35, '0', '/api/cloud/files/03536a4b-877b-45fa-9831-a7350418ab0f', '6', 8, '2025-11-04 11:00:35'),
(1177, 35, '0', '/api/cloud/files/7d695b40-acaa-43ca-88db-28bd87ced934', '7', 9, '2025-11-04 11:00:35'),
(1178, 35, '0', '/api/cloud/files/c6b4f520-5320-497a-82d9-01221cbb4fb7', '9', 10, '2025-11-04 11:00:35'),
(1185, 37, '0', '/api/cloud/files/fcef355c-6665-45c8-a297-cf776bde84ba', 'aa1', 1, '2025-11-04 11:06:07'),
(1186, 37, '0', '/api/cloud/files/190cdaa2-28b3-46f7-be86-303a0e5f0628', 'aa3', 2, '2025-11-04 11:06:07'),
(1187, 37, '0', '/api/cloud/files/25b6a314-b167-4257-9dcc-dcace75d097f', 'aa5', 3, '2025-11-04 11:06:07'),
(1188, 38, '0', '/api/cloud/files/b8b8056e-9921-4398-996e-267308819cda', '1C_Postttt', 1, '2025-11-04 11:07:48'),
(1189, 36, '0', '/api/cloud/files/1850bff4-8cc9-4c9e-81cd-83b027d956a6', '1 copy', 1, '2025-11-06 09:46:46'),
(1190, 36, '0', '/api/cloud/files/c74a1020-33ca-404c-98bf-2324a0c6311e', '14 copy', 2, '2025-11-06 09:46:46'),
(1191, 36, '0', '/api/cloud/files/d0c4d9a0-d133-4e4c-a30c-f21a33c3fd55', '33 copy', 3, '2025-11-06 09:46:46'),
(1192, 36, '0', '/api/cloud/files/954bb0c4-b160-4c5f-abed-881f80e06d4a', 'a5 copy', 4, '2025-11-06 09:46:46'),
(1193, 36, '0', '/api/cloud/files/a3e791ff-f4e8-4428-997d-2c2ab4b293ca', 'a7 copy', 5, '2025-11-06 09:46:46'),
(1194, 36, '0', '/api/cloud/files/f0ddbe44-6c3f-4cc5-88de-b995ee4b97ac', 'a11 copy', 6, '2025-11-06 09:46:46'),
(1195, 39, '0', '/api/cloud/files/8e213dba-1c81-4f1d-816c-eb61e9455c59', 'A', 1, '2025-11-13 11:04:06'),
(1196, 39, '0', '/api/cloud/files/607c88d3-8025-45bc-8e91-2eccc4c57356', 'B', 2, '2025-11-13 11:04:06'),
(1197, 39, '0', '/api/cloud/files/40a4abbf-df94-4379-af04-3f71b39937c4', 'C', 3, '2025-11-13 11:04:06'),
(1198, 39, '0', '/api/cloud/files/e74ce733-7e56-4fbf-8277-c5acde21ff67', 'D', 4, '2025-11-13 11:04:06'),
(1201, 41, '0', '/api/cloud/files/47bb3009-a39e-4af5-91c0-e3765370306f', '1', 1, '2025-11-15 12:41:52'),
(1202, 41, '0', '/api/cloud/files/f698520b-6b79-412a-983c-3afe58d3f1c9', '3', 2, '2025-11-15 12:41:52'),
(1203, 41, '0', '/api/cloud/files/0ffe06e9-c323-4d98-9a53-1d9472e2bbcb', '6', 3, '2025-11-15 12:41:52'),
(1204, 41, '0', '/api/cloud/files/e2ec7b4a-1258-4511-8caf-48dc1334decb', '8', 4, '2025-11-15 12:41:52');

-- --------------------------------------------------------

--
-- Table structure for table `graphics`
--

CREATE TABLE `graphics` (
  `id` int(11) NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `graphics`
--

INSERT INTO `graphics` (`id`, `image_url`, `created_at`, `updated_at`) VALUES
(17, 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/b80fb8c1-32b9-491f-8534-19de3abbd715', '2025-10-27 22:46:34', '2025-10-27 23:15:28'),
(18, 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/c4e17d07-4c89-47c9-a132-4aaca58c810c', '2025-10-27 22:46:34', '2025-10-27 23:15:28'),
(19, 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/a29b88ec-0a5b-4e20-8ea9-7bbe6d12cfb5', '2025-10-27 22:46:34', '2025-10-27 23:15:28'),
(20, 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/0e792d66-314f-4d1d-b901-d35f74464eb1', '2025-10-27 22:46:34', '2025-10-27 23:15:28'),
(21, 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/661ea67d-e7dc-4d1d-b146-2c9de992b7a4', '2025-10-27 22:46:34', '2025-10-27 23:15:28'),
(22, 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/b881d845-0341-444f-8fce-690c4769a02a', '2025-10-27 22:46:34', '2025-10-27 23:15:28'),
(23, 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/dd43d4b8-7a40-4c88-9d75-bc4b3e737c38', '2025-10-27 22:46:34', '2025-10-27 23:15:28'),
(24, 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/c5b01f9d-c6e5-4ee9-ae5d-921fc89eb53c', '2025-10-27 22:46:34', '2025-10-27 23:15:28');

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` varchar(36) NOT NULL ,
  `customer_id` varchar(36) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` varchar(255) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoices`
--

INSERT INTO `invoices` (`id`, `customer_id`, `amount`, `status`, `date`) VALUES
('51b9eab2-a100-11f0-bd74-0aad4759eb8d', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
('51ba11b8-a100-11f0-bd74-0aad4759eb8d', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
('51ba289c-a100-11f0-bd74-0aad4759eb8d', '76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
('51ba35d0-a100-11f0-bd74-0aad4759eb8d', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
('51ba4fa2-a100-11f0-bd74-0aad4759eb8d', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16'),
('51ba697e-a100-11f0-bd74-0aad4759eb8d', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27'),
('51ba7964-a100-11f0-bd74-0aad4759eb8d', '76d65c26-f784-44a2-ac19-586678f7c2f2', 32545, 'paid', '2023-06-09'),
('51ba8544-a100-11f0-bd74-0aad4759eb8d', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 1250, 'paid', '2023-06-17'),
('51ba9322-a100-11f0-bd74-0aad4759eb8d', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8546, 'paid', '2023-06-07'),
('51baa5b0-a100-11f0-bd74-0aad4759eb8d', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19'),
('51bad56c-a100-11f0-bd74-0aad4759eb8d', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8945, 'paid', '2023-06-03'),
('51baf0ba-a100-11f0-bd74-0aad4759eb8d', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05'),
('7c1a5b66-7f31-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2022-12-06'),
('7c1ada32-7f31-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
('7c1b09ee-7f31-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
('7c1b230c-7f31-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
('7c1b3018-7f31-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
('7c1b4ab2-7f31-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16'),
('7c1b6f56-7f31-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27'),
('7c1b86d0-7f31-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 32545, 'paid', '2023-06-09'),
('7c1b9710-7f31-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 1250, 'paid', '2023-06-17'),
('7c1ba9c6-7f31-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8546, 'paid', '2023-06-07'),
('7c1bc6fe-7f31-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19'),
('7c1bd612-7f31-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8945, 'paid', '2023-06-03'),
('7c1be620-7f31-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05'),
('803953ac-8083-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2022-12-06'),
('8039d160-8083-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
('8039ee52-8083-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
('8039fdac-8083-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
('803a1a8a-8083-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
('803a2b60-8083-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16'),
('803a4686-8083-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27'),
('803a6512-8083-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 32545, 'paid', '2023-06-09'),
('803a8074-8083-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 1250, 'paid', '2023-06-17'),
('803a96e0-8083-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8546, 'paid', '2023-06-07'),
('803aad06-8083-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19'),
('803abdf0-8083-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8945, 'paid', '2023-06-03'),
('803ad5d8-8083-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05'),
('87498abc-7e6d-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 99900, 'paid', '2025-08-21'),
('89064f04-8181-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2022-12-06'),
('89068d70-8181-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
('8906a15c-8181-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
('8906b5ca-8181-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
('8906e7f2-8181-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
('8906f9f4-8181-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16'),
('89070a2a-8181-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27'),
('89071d94-8181-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 32545, 'paid', '2023-06-09'),
('89073130-8181-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 1250, 'paid', '2023-06-17'),
('89074152-8181-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8546, 'paid', '2023-06-07'),
('89075304-8181-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19'),
('89076128-8181-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8945, 'paid', '2023-06-03'),
('89076f74-8181-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05'),
('8da16d32-b17e-11f0-b1f4-171420638fa7', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2022-12-06'),
('8da20e18-b17e-11f0-b1f4-171420638fa7', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
('8da25c56-b17e-11f0-b1f4-171420638fa7', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
('8da28014-b17e-11f0-b1f4-171420638fa7', '76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
('8da2b5b6-b17e-11f0-b1f4-171420638fa7', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
('8da2d15e-b17e-11f0-b1f4-171420638fa7', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16'),
('8da2e752-b17e-11f0-b1f4-171420638fa7', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27'),
('8da2f8aa-b17e-11f0-b1f4-171420638fa7', '76d65c26-f784-44a2-ac19-586678f7c2f2', 32545, 'paid', '2023-06-09'),
('8da30a48-b17e-11f0-b1f4-171420638fa7', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 1250, 'paid', '2023-06-17'),
('8da31b5a-b17e-11f0-b1f4-171420638fa7', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8546, 'paid', '2023-06-07'),
('8da32c12-b17e-11f0-b1f4-171420638fa7', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19'),
('8da33c70-b17e-11f0-b1f4-171420638fa7', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8945, 'paid', '2023-06-03'),
('8da34ec2-b17e-11f0-b1f4-171420638fa7', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05'),
('96bf7fe2-ac0d-11f0-aaa9-4de7a06b35ca', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2022-12-06'),
('96bf9a86-ac0d-11f0-aaa9-4de7a06b35ca', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
('96bfb8c2-ac0d-11f0-aaa9-4de7a06b35ca', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
('96bfd08c-ac0d-11f0-aaa9-4de7a06b35ca', '76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
('96bfe09a-ac0d-11f0-aaa9-4de7a06b35ca', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
('96bff2f6-ac0d-11f0-aaa9-4de7a06b35ca', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16'),
('96c0055c-ac0d-11f0-aaa9-4de7a06b35ca', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27'),
('96c01bc8-ac0d-11f0-aaa9-4de7a06b35ca', '76d65c26-f784-44a2-ac19-586678f7c2f2', 32545, 'paid', '2023-06-09'),
('96c02d48-ac0d-11f0-aaa9-4de7a06b35ca', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 1250, 'paid', '2023-06-17'),
('96c03ce8-ac0d-11f0-aaa9-4de7a06b35ca', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8546, 'paid', '2023-06-07'),
('96c04e4a-ac0d-11f0-aaa9-4de7a06b35ca', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19'),
('96c05e08-ac0d-11f0-aaa9-4de7a06b35ca', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8945, 'paid', '2023-06-03'),
('96c074e2-ac0d-11f0-aaa9-4de7a06b35ca', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05'),
('af58ee00-7e70-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 3300, 'paid', '2025-08-21'),
('d3036bfc-807b-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2022-12-06'),
('d3037bf6-807b-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
('d3039014-807b-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
('d303a3ba-807b-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
('d303af36-807b-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
('d303c458-807b-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16'),
('d303cdc2-807b-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27'),
('d303d646-807b-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 32545, 'paid', '2023-06-09'),
('d303df7e-807b-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 1250, 'paid', '2023-06-17'),
('d303f70c-807b-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8546, 'paid', '2023-06-07'),
('d3040260-807b-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19'),
('d3041a02-807b-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8945, 'paid', '2023-06-03'),
('d30426e6-807b-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05'),
('f367d5ee-8081-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 15795, 'pending', '2022-12-06'),
('f367f38a-8081-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 20348, 'pending', '2022-11-14'),
('f3680546-8081-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 3040, 'paid', '2022-10-29'),
('f3681dba-8081-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 44800, 'paid', '2023-09-10'),
('f3683674-8081-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 34577, 'pending', '2023-08-05'),
('f36850dc-8081-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 54246, 'pending', '2023-07-16'),
('f36866d0-8081-11f0-aa44-a5497d977eb3', 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa', 666, 'pending', '2023-06-27'),
('f368891c-8081-11f0-aa44-a5497d977eb3', '76d65c26-f784-44a2-ac19-586678f7c2f2', 32545, 'paid', '2023-06-09'),
('f368a55a-8081-11f0-aa44-a5497d977eb3', 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9', 1250, 'paid', '2023-06-17'),
('f368ccce-8081-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8546, 'paid', '2023-06-07'),
('f368ec04-8081-11f0-aa44-a5497d977eb3', '3958dc9e-712f-4377-85e9-fec4b6a6442a', 500, 'paid', '2023-08-19'),
('f36908ce-8081-11f0-aa44-a5497d977eb3', '13D07535-C59E-4157-A011-F8D2EF4E0CBB', 8945, 'paid', '2023-06-03'),
('f36917d8-8081-11f0-aa44-a5497d977eb3', '3958dc9e-742f-4377-85e9-fec4b6a6442a', 1000, 'paid', '2022-06-05');

-- --------------------------------------------------------

--
-- Table structure for table `locations`
--

CREATE TABLE `locations` (
  `id` int(11) NOT NULL,
  `country_id` int(11) NOT NULL,
  `city_ku` varchar(255) NOT NULL,
  `city_ar` varchar(255) NOT NULL,
  `city_en` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `locations`
--

INSERT INTO `locations` (`id`, `country_id`, `city_ku`, `city_ar`, `city_en`, `created_at`, `updated_at`) VALUES
(1, 1, 'بەغدا', 'بغداد', 'Baghdad', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(2, 1, 'بەسرە', 'البصرة', 'Basra', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(3, 1, 'زوبەیر', 'الزبير', 'Zubair', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(4, 1, 'قورنە', 'القرنة', 'Al-Qurna', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(5, 1, 'موسڵ', 'الموصل', 'Mosul', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(6, 1, 'تەلەعفەر', 'تلعفر', 'Tal Afar', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(7, 1, 'سنجار', 'سنجار', 'Sinjar', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(8, 1, 'هەولێر', 'أربيل', 'Erbil', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(9, 1, 'کۆیە', 'كويسنجق', 'Koya', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(10, 1, 'شەقڵاوە', 'شقلاوة', 'Shaqlawa', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(11, 1, 'سلێمانی', 'السليمانية', 'Sulaymaniyah', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(12, 1, 'ڕانیە', 'رانية', 'Rania', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(13, 1, 'قەڵادزێ', 'قلعة دزة', 'Qalat Dizah', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(14, 1, 'دهۆک', 'دهوك', 'Duhok', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(15, 1, 'زاخۆ', 'زاخو', 'Zakho', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(16, 1, 'ئاكرێ', 'عقرة', 'Akre', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(17, 1, 'کەرکوک', 'كركوك', 'Kirkuk', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(18, 1, 'ڕەمادی', 'الرمادي', 'Ramadi', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(19, 1, 'فەلووجە', 'الفلوجة', 'Fallujah', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(20, 1, 'حەدیسە', 'حديثة', 'Haditha', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(21, 1, 'حیلە', 'الحلة', 'Hillah', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(22, 1, 'مەحاویل', 'المحاويل', 'Mahawil', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(23, 1, 'کەربەلا', 'كربلاء', 'Karbala', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(24, 1, 'نەجەف', 'النجف', 'Najaf', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(25, 1, 'کووفە', 'الكوفة', 'Kufa', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(26, 1, 'کووت', 'الكوت', 'Al-Kut', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(27, 1, 'عەزیزیە', 'العزيزية', 'Al-Aziziya', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(28, 1, 'تکریت', 'تكريت', 'Tikrit', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(29, 1, 'سامەڕا', 'سامراء', 'Samarra', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(30, 1, 'بەیجی', 'بيجي', 'Baiji', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(31, 1, 'بەعقووبە', 'بعقوبة', 'Baqubah', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(32, 1, 'خانەقین', 'خانقين', 'Khanaqin', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(33, 1, 'مەندەلی', 'مندلي', 'Mandali', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(34, 1, 'دیوانیە', 'الديوانية', 'Diwaniya', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(35, 1, 'عەفەک', 'عفك', 'Afak', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(36, 1, 'ناسریە', 'الناصرية', 'Nasiriyah', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(37, 1, 'شەترە', 'الشطرة', 'Shatra', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(38, 1, 'عەمارە', 'العمارة', 'Amarah', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(39, 1, 'قەڵەت سالح', 'قلعة صالح', 'Qalat Saleh', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(40, 1, 'سەماوە', 'السماوة', 'Samawah', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(41, 1, 'ڕومەیسە', 'الرميثة', 'Rumaitha', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(42, 1, 'هەڵەبجە', 'حلبجة', 'Halabja', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(43, 1, 'ئامێدی', 'العمادية', 'Amedi', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(44, 1, 'ڕەواندوز', 'راوندوز', 'Rawanduz', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(45, 1, 'سۆران', 'سوران', 'Soran', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(46, 1, 'مەخموور', 'مخمور', 'Makhmur', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(47, 1, 'تێڵکەیف', 'تلكيف', 'Telkaif', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(48, 1, 'هیت', 'هيت', 'Hit', '2025-10-20 07:18:18', '2025-10-20 07:18:18'),
(53, 1, 'کەلار', 'کلار', 'Kalar', '2025-11-02 13:03:40', '2025-11-02 13:06:15');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `title_ar` varchar(155) NOT NULL,
  `title_en` varchar(155) NOT NULL,
  `title_ku` varchar(155) NOT NULL,
  `description_ar` text NOT NULL,
  `description_en` text NOT NULL,
  `description_ku` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `title_ar`, `title_en`, `title_ku`, `description_ar`, `description_en`, `description_ku`) VALUES
(2, 'كرسي', 'chair', 'کورسی', 'يتميز الكرسي بجماليات معاصرة مستوحاة من الطراز الاسكندنافي - أنيق، عملي، وعملي. تصميمه مدمج وجذاب في آنٍ واحد، مما يجعله مناسبًا لمجموعة متنوعة من الديكورات الداخلية، مثل غرف الطعام، والمكاتب المنزلية، وغرف الجلوس.', 'The chair features a contemporary Scandinavian-inspired aesthetic — clean, functional, and elegant. Its silhouette is compact yet inviting, making it suitable for a variety of interior settings such as dining rooms, home offices, or lounge areas.', 'کورسییەکە جوانکارییەکی هاوچەرخی هەیە کە لە ئیلهامەکانی سکاندیناڤیاوە وەرگیراوە — پاک و خاوێنی و کارایی و ڕەسەن. سیلۆیەتەکەی کۆمپاکت و لە هەمان کاتدا بانگهێشتکەر، ئەمەش وای لێدەکات گونجاو بێت بۆ چەندین شوێنی ناوەوەی وەک ژووری نانخواردن، ئۆفیسی ماڵەوە، یان شوێنی دانیشتن.');

-- --------------------------------------------------------

--
-- Table structure for table `product_groups`
--

CREATE TABLE `product_groups` (
  `id` int(11) NOT NULL,
  `title_ku` varchar(155) NOT NULL,
  `title_ar` varchar(155) NOT NULL,
  `title_en` varchar(155) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product_groups`
--

INSERT INTO `product_groups` (`id`, `title_ku`, `title_ar`, `title_en`) VALUES
(1, 'ئامێرەکانی کشتوکاڵ', 'آلات الزراعة', 'mira test'),
(4, ';fdaljsd', 'asldkjf', ';asldkjf'),
(5, 'sd;flkj', ';slkdjf', ';slkdjf'),
(6, 'asdf', 'asdf', 'asdf'),
(7, 'ئامێرەکانی کشتوکاڵ', 'آلات الزراعة', 'Agricultural Machinery'),
(9, 'ئامێرەکانی پیشەسازی', 'آلات الصناعة', 'Industrial Machinery'),
(10, 'ئامێرەکانی کشتوکاڵ', 'آلات الزراعة', 'Agricultural Machinery'),
(12, 'ئامێرەکانی پیشەسازی', 'آلات الصناعة', 'Industrial Machinery');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `title_ku` varchar(100) NOT NULL,
  `title_ar` varchar(100) NOT NULL,
  `title_en` varchar(100) NOT NULL,
  `description_en` text NOT NULL,
  `description_ar` text NOT NULL,
  `description_ku` text NOT NULL,
  `date` date NOT NULL,
  `project_category` int(11) DEFAULT NULL,
  `project_status` tinyint(4) DEFAULT 0,
  `location_id` int(11) DEFAULT NULL,
  `project_sub_category` int(11) DEFAULT 0,
  `project_type` enum('0','1','2') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title_ku`, `title_ar`, `title_en`, `description_en`, `description_ar`, `description_ku`, `date`, `project_category`, `project_status`, `location_id`, `project_sub_category`, `project_type`) VALUES
(13, 'دیزاینی شاری خەونەکان', 'تصميم مدينة الأحلام', 'Dream City Design', 'We at Value Architects are honored to contribute to the development of the\r\nCity of Dreams in Basra, Iraq. We are proud to be part of this important\r\nproject, which embodies a unique vision in the beautiful city of Basra.\r\nThrough hard work and teamwork, we have successfully completed this\r\nendeavor, and we hope it will become a landmark in the region. We are\r\ngrateful for the opportunity to work with you, and we look forward to future\r\ncolaborations and recommendations.', 'نحن في [Value Architects] نتشرف بالمساهمة في تطوير مدينة الأحلام في البصرة، العراق. ونفخر بكوننا جزءًا من هذا المشروع المهم، الذي يجسد رؤية فريدة لمدينة البصرة الجميلة.\r\n\r\nبفضل العمل الجاد والعمل الجماعي، أنجزنا هذا المسعى بنجاح، ونأمل أن يصبح معلمًا بارزًا في المنطقة. نحن ممتنون لفرصة العمل معكم، ونتطلع إلى تعاونات وتوصيات مستقبلية.', 'ئێمە لە تەلارسازەکانی بەها شانازی دەکەین کە بەشداری بکەین لە پەرەپێدانی...\r\nشاری خەونەکان لە شاری بەسرە لە عێراق. ئێمە شانازی دەکەین کە بەشێکین لەم گرنگە\r\nپڕۆژە، کە دیدێکی ناوازە لە شاری جوانی بەسرە بەرجەستە دەکات.\r\nلە ڕێگەی کاری قورس و کاری تیمییەوە، ئێمە بە سەرکەوتوویی ئەم کارەمان تەواو کردووە\r\nهەوڵ بدەن، و هیوادارین ببێتە هێمایەکی گرینگ لە ناوچەکەدا. ئێمە\r\nسوپاسگوزارین بۆ دەرفەتی کارکردن لەگەڵ ئێوە، و ئێمە چاوەڕوانی داهاتووین\r\nهاوکاری و پێشنیارەکان.\"', '2025-07-08', 6, 1, 2, 11, '0'),
(17, 'بینای بازرگانی', 'مبنى تجاري', 'commercial building', 'commercial building', 'مبنى تجاري', 'بینای بازرگانی', '2023-01-05', 10, 1, 11, NULL, '0'),
(18, 'کافتریای غرام', ' مقهى غرام', 'GHARAM CAFE ', 'Ghram Cafeteria in Baghdad has been designed by the Value team', 'تم تصميم كافتيريا غرام في بغداد من قبل فريق فاليو', 'کافتریای غرام لە شاری بغداد کاری دیزاینی ناوەوەی کافتریاکەیان لەلایەن تیمی ڤالیو جێبێ کراوە ', '2022-10-23', 7, 1, 1, 4, '0'),
(19, 'دیزاینی بەشی ناوەوەی خانوو', 'التصميم الداخلي للمنزل', 'Interior design of house', 'Interior design of residential house in Sulaimani Bakrajo area', 'تصميم داخلي لمنزل سكني في منطقة السليمانية بكرجو', 'دیزاینی بەشی ناوەوەی خانوی نیشتەجێبوون لە شاری سلێمانی ناوچەی بەکرەجۆ', '2023-12-28', 7, 1, 11, 1, '0'),
(20, 'دیزاینی ناوەوەی خانوو', 'التصميم الداخلي للمنزل', 'Interior design of house', 'Interior design of a modern and contemporary residential unit in Kirkuk by Value Engineering Team', 'التصميم الداخلي لوحدة سكنية حديثة ومعاصرة في كركوك من قبل فريق الهندسة القيمية', 'دیزاینی ناوەوەی یەکەی نیشتەجێبوون بە شێوازی مۆدێرن و سەردەمیانە لە شاری  کەرکوک لەلایەن تیمی ئەندازیاری ڤالیوو', '2023-03-13', 7, 1, 17, 1, '0'),
(21, 'دیزاینی ناوەوە', 'التصميم الداخلي', 'Interior Design', 'Interior design of a residential unit in a modern style in the heights of Sulaimani by Value Engineering Team', 'التصميم الداخلي لوحدة سكنية على الطراز الحديث في مرتفعات السليمانية من قبل فريق الهندسة القيمية', 'دیزاینی ناوەوەی یەکەی نیشتەجێبوون بە شێوازی مۆدێرن و سەردەمیانە لەبەرزایەکانی سلێمانی لەلایەن تیمی ئەندازیاری ڤالیوو', '2024-08-13', 7, 1, 11, 1, '0'),
(22, 'دیزاینی ناوەوەی خانوو', 'التصميم الداخلي للمنزل ', 'Interior design of house', 'Interior design of residential units in a modern and contemporary style by Value Engineering Team in Kalar', 'التصميم الداخلي للوحدات السكنية بأسلوب حديث ومعاصر من قبل فريق الهندسة القيمية في كلار', 'دیزاینی ناوەوەی یەکەی نیشتەجێبوون بە شێوازێکی مۆدێرن  و سەردەمیانە  لەلایەن تیمی ئەندازیاری ڤالیو لەشاری کەلار', '2022-03-02', 7, 1, 53, 1, '0'),
(23, 'دیزاینی کلاسیکی نیشتەجێبوون', 'تصميم سكني كلاسيكي', ' Residential classic design', ' Residential classic design', 'تصميم سكني كلاسيكي', 'دیزاینی کلاسیکی نیشتەجێبوون', '2021-10-27', 7, 1, 11, 1, '0'),
(24, 'شاری سپی ', 'مدينة سبي', 'Spi city ', 'Spi city ', 'مدينة سبي', 'شاری سپی ', '2023-07-30', 7, 1, 11, 1, '0'),
(25, 'دیزاینی ناوەوەی خانوو', 'التصميم الداخلي للمنزل', 'Interior design of house', 'Interior design of house', 'التصميم الداخلي للمنزل', 'دیزاینی ناوەوەی خانوو', '2023-02-11', 7, 1, 11, 1, '0'),
(26, 'دیزاینی ناوەوەی یەکەی نیشتەجێبوون ', 'التصميم الداخلي للوحدة السكنية', 'Interior design of the residential unit', 'Interior design of residential units in a modern and contemporary style by Value Engineering Team in Kirkuk', 'التصميم الداخلي للوحدات السكنية بأسلوب حديث ومعاصر من قبل فريق الهندسة القيمية في كركوك', 'دیزاینی ناوەوەی یەکەی نیشتەجێبوون بە شێوازێکی مۆدێرن  و سەردەمیانە  لەلایەن تیمی ئەندازیاری ڤالیو لەشاری کەرکوک\r\n', '2023-08-20', 7, 1, 17, 1, '0'),
(27, 'پارک77- نیشتەجێبوون', 'بارك 77-سكني', 'Park77-Residential', 'Park77-Residential', 'بارك 77-سكني', 'پارک77- نیشتەجێبوون', '2022-09-13', 7, 1, 11, 1, '0'),
(28, 'شاری بابان ', 'مدينة بابان', 'Baban City ', 'Interior Design of Residential Unit in Baban City in Sulaimani, Value Engineering Agency supervised the interior design of residential unit in Baban City in Sulaimani', 'التصميم الداخلي لوحدة سكنية في مدينة بابان في السليمانية، أشرفت وكالة الهندسة القيمية على التصميم الداخلي لوحدة سكنية في مدينة بابان في السليمانية', 'دیزاین کردنی ناوەوەی یەکەی نیشتەجێبوون لە شاری بابان لە سلێمانی، نوسینگەی ئەندازیاری ڤالیوو سەرپەرشتی دیزاینی ناوەوەی یەکەی نیشتەجێبوونی کرد لە شاری بابان لە شاری سلێمانی ', '2023-08-26', 7, 0, 11, 1, '0'),
(29, 'مۆبیلیاتی هۆم لاین', 'أثاث هوم لاين', 'Homeline Mobilya', 'Homeline Mobilya', 'أثاث هوم لاين', 'مۆبیلیاتی هۆم لاین', '2024-03-06', 7, 1, 11, 5, '0'),
(30, 'جێف جیم ', 'جیف جیم', 'JEFF\'S GYM', 'Construction of Jeff gym Welfare and Entertainment Unit in Sulaimani by Value Agency in a modern and attractive manner', 'إنشاء وحدة جيف جيم للرعاية والترفيه في السليمانية من قبل وكالة فاليو بطريقة حديثة وجذابة', 'دروست کردنی یەکەی  خۆشگوزەرانی و کات بەسەربردنی جێف جیم لە شاری سلێمانی لەلایەن نوسینەگەی ڤالیو بەشێوازی سەردەمیانەو سەرنج ڕاکێش ', '2022-05-17', 7, 1, 11, 10, '0'),
(32, 'کۆمپانیای ئاوێزان ', 'شركة أويزان', 'awezan company ', 'Exterior of  Awezan Company implemented by Value Engineering Team', 'الواجهة الخارجية لشركة أفزان التي نفذها فريق الهندسة فالیوو', 'ڕوکاری دەرەوەی کۆمپانیای ئاوێزان کە لەلایەن تیمی ئەندازیاری ڤالیوو جێبەجێ کراوە ', '2022-10-04', 6, 1, 11, 12, '0'),
(33, 'میوان خانەی هێڤین ', 'فندق هيفين', ' Hevin Motel', 'The exterior design of Hevin Hotel in Sarchnar, Sulaimani, was executed by the engineering staff of Value.\r\n\r\n', 'تم تنفيذ التصميم الخارجي لفندق هيفين في سرجنار بالسليمانية من قبل فريق الهندسة في شركة فاليو.\r\n', 'میوان خانەی هێڤین  لە سەرچناری سلێمانی  دیزاینی دەرەوەی بیناکەیان جێبەجێ کراوە لەلایەن ستافی ئەندازیاری ڤالیوو', '2023-10-11', 6, 1, 11, 12, '0'),
(34, 'بینای بازرگانی', 'مبنى تجاري', 'commercial building', 'The exterior design of their building has been implemented by Value Engineering staff', 'تم تنفيذ التصميم الخارجي للمبنى من قبل موظفي الهندسة فالیوو', ' دیزاینی دەرەوەی بیناکەیان جێبەجێ کراوە لەلایەن ستافی ئەندازیاری ڤالیوو', '2024-12-01', 6, 0, 11, 12, '0'),
(35, 'فەرمانگەی ڕێکخستنی پایتەختی کەرکوک', 'مكتب تنظيم العاصمة كركوك', 'Kirkuk Capital Organization Office', 'Kirkuk Capital Organization Office', 'مكتب تنظيم العاصمة كركوك', 'فەرمانگەی ڕێکخستنی پایتەختی کەرکوک', '2024-07-20', 6, 0, 11, 14, '0'),
(36, 'بەرزایەکانی ', 'برزایکان', 'Barzayakan ', 'Exterior design of residential unit in Sulaimani heights', 'التصميم الخارجي لوحدة سكنية في مرتفعات السليمانية', 'دیزاینی دەرەوەی یەکەی نیشتەجێبوون لە بەرزایەکانی سلێمانی ', '2024-11-11', 6, 1, 11, 11, '1'),
(37, 'دیزاینی دەرەوە شوێنی نیشتەجێبوون', 'التصميم الخارجي السكني', 'Exterior Design Residential', 'Exterior Design Residential', 'التصميم الخارجي السكني', 'دیزاینی دەرەوە شوێنی نیشتەجێبوون', '2022-10-15', 6, 1, 1, 11, '0'),
(38, 'دیزاینی دەرەوە شوێنی نیشتەجێبوون', 'التصميم الخارجي السكني', 'Exterior Design Residential', 'Exterior Design Residential', 'التصميم الخارجي السكني', 'دیزاینی دەرەوە شوێنی نیشتەجێبوون', '2022-07-06', 6, 1, 11, 11, '0'),
(39, 'دیزاینی ڕوکاری دەرەوەی خانوو', 'التصميم الخارجي السكني', 'Exterior Design Residential', 'Exterior Design Residential', 'التصميم الخارجي السكني', 'دیزاینی ڕوکاری دەرەوەی خانوو', '2025-11-06', 6, 1, 17, 11, '0'),
(41, 'دیزاینی ناوەوە نیشتەجێبوون', 'التصميم الداخلي السكني', 'interior Design Residential', 'interior Design Residential', 'التصميم الداخلي السكني', 'دیزاینی ناوەوە نیشتەجێبوون', '2024-02-15', 7, 0, 11, 1, '0');

-- --------------------------------------------------------

--
-- Table structure for table `project_categories`
--

CREATE TABLE `project_categories` (
  `id` int(11) NOT NULL,
  `title_ku` varchar(255) NOT NULL,
  `title_ar` varchar(255) NOT NULL,
  `title_en` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_categories`
--

INSERT INTO `project_categories` (`id`, `title_ku`, `title_ar`, `title_en`) VALUES
(4, 'کۆمەڵگەی نیشتەجێبوون', 'مجمع سكني', 'Residential Complex'),
(5, 'دیزاینی باخچە', 'تصميم المناظر الطبيعية', 'Landscape Design'),
(6, 'دیزاینی دەرەوە', 'تصميم خارجي', 'Exterior Design'),
(7, 'دیزاینی ناوەوە', 'تصميم داخلي', 'Interior Design'),
(8, 'دیزاینی شار و پلاندانانی شوێن', 'التصميم الحضري وتخطيط الموقع', 'Urban Design & Siteplanning'),
(10, 'پێشنیاز', 'اقتراح', 'proposal');

-- --------------------------------------------------------

--
-- Table structure for table `properties`
--

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `key` varchar(150) NOT NULL,
  `value_ku` varchar(255) NOT NULL,
  `value_ar` varchar(255) NOT NULL,
  `value_en` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `properties`
--

INSERT INTO `properties` (`id`, `key`, `value_ku`, `value_ar`, `value_en`) VALUES
(2, 'about_years_experience', '5+', '5+', '5+'),
(3, 'about_completed_projects', '150+', '150+', '150+'),
(4, 'about_satisfied_clients', '100+', '100+', '100+'),
(5, 'about_team_members', '15+', '15+', '15+'),
(6, 'about_years_experience_label', 'ساڵ ئەزموون', 'سنوات الخبرة', 'Years Experience'),
(7, 'about_completed_projects_label', 'پڕۆژەی تەواوکراو', 'المشاريع المكتملة', 'Completed Projects'),
(8, 'about_satisfied_clients_label', 'کڕیاری ڕازی', 'العملاء الراضون', 'Satisfied Clients'),
(9, 'about_team_members_label', 'ئەندامی تیم', 'أعضاء الفريق', 'Team Members'),
(10, 'about_years_experience', '5+', '5+', '5+');

-- --------------------------------------------------------

--
-- Table structure for table `quotes`
--

CREATE TABLE `quotes` (
  `id` int(11) NOT NULL,
  `title_ku` text NOT NULL,
  `title_en` text NOT NULL,
  `title_ar` text NOT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quotes`
--

INSERT INTO `quotes` (`id`, `title_ku`, `title_en`, `title_ar`, `image_url`) VALUES
(16, 'نجحت شركة Value Architects في إكمال محفظة متنوعة من الأعمال بنجاح، بما في ذلك 9 مشاريع للمناظر الطبيعية مصممة بعناية، و185 تصميمًا داخليًا مصممًا بعناية، و260 منزلًا مخططًا بشكل فريد، و58 مصنعًا وظيفيًا.', 'Value Architects has successfully completed a diverse portfolio of work, including 9 meticulously designed landscape projects, 185 thoughtfully crafted interior designs, 260 uniquely planned houses, and 58 functional factories.', 'کۆمپانیای Value Architects بە سەرکەوتوویی پۆرتفۆلیۆیەکی هەمەچەشنی کارەکانی تەواو کردووە، لەوانە 9 پڕۆژەی دیمەنی سروشتی کە بە وردی دیزاین کراون، 185 دیزاینی ناوەوە کە بە بیرکردنەوە دروستکراون، 260 خانووی پلان بۆ داڕێژراوی ناوازە، و 58 کارگەی کارایی.', '/api/cloud/files/9e69b770-77a5-457a-b715-7e5ffb16a09e');

-- --------------------------------------------------------

--
-- Table structure for table `revenue`
--

CREATE TABLE `revenue` (
  `month` varchar(4) NOT NULL,
  `revenue` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `revenue`
--

INSERT INTO `revenue` (`month`, `revenue`) VALUES
('Apr', 2500),
('Aug', 3700),
('Dec', 4800),
('Feb', 1800),
('Jan', 2000),
('Jul', 3500),
('Jun', 3200),
('Mar', 2200),
('May', 2300),
('Nov', 3000),
('Oct', 2800),
('Sep', 2500);

-- --------------------------------------------------------

--
-- Table structure for table `social_media`
--

CREATE TABLE `social_media` (
  `id` varchar(36) NOT NULL ,
  `type` int(11) NOT NULL,
  `url` varchar(500) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `social_media`
--

INSERT INTO `social_media` (`id`, `type`, `url`, `created_at`, `updated_at`) VALUES
('80424cc8-8083-11f0-aa44-a5497d977eb3', 0, 'https://www.instagram.com/value.architects/', '2025-08-24 00:44:32', '2025-10-25 08:45:19'),
('804267bc-8083-11f0-aa44-a5497d977eb3', 1, 'https://www.facebook.com/value.Architect.group', '2025-08-24 00:44:32', '2025-10-25 08:44:02'),
('uuid()', 3, '+964 770 190 6763', '2025-10-28 15:17:44', '2025-10-28 15:17:44');

-- --------------------------------------------------------

--
-- Table structure for table `special_projects`
--

CREATE TABLE `special_projects` (
  `id` varchar(36) NOT NULL ,
  `image_url` varchar(500) NOT NULL,
  `sort_order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `special_projects`
--

INSERT INTO `special_projects` (`id`, `image_url`, `sort_order`, `created_at`, `updated_at`) VALUES
('4fab44a6-ab95-11f0-b9f9-a30f62be92a0', '/api/cloud/files/64fc2280-e3d8-4f7a-97d2-31353cd36e80', 0, '2025-10-17 20:10:22', '2025-10-17 20:10:22');

-- --------------------------------------------------------

--
-- Table structure for table `sub_categorys`
--

CREATE TABLE `sub_categorys` (
  `id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `title_ku` varchar(100) NOT NULL,
  `title_ar` varchar(100) NOT NULL,
  `title_en` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sub_categorys`
--

INSERT INTO `sub_categorys` (`id`, `category_id`, `title_ku`, `title_ar`, `title_en`) VALUES
(1, 7, 'دیزاینی ناوخۆی نیشتەجێبوون', 'تصميمات داخلية سكنية', 'Residential Interiors'),
(3, 7, 'دیزاینی ناوخۆی چاودێری تەندروستی', 'تصميمات داخلية للرعاية الصحية', 'Health Care Interiors'),
(4, 7, 'ڕێستورانت و کافێ', 'مطعم ومقهى', 'Restaurant and Cafe'),
(5, 7, 'فرۆشگا / دوکان / مەخزەن', 'محل بيع بالتجزئة / دكان / منفذ بيع', 'Retail / Shop / Outlet'),
(6, 7, 'پیشەسازی', 'صناعي', 'Industrial'),
(7, 7, 'هۆتێل', 'فندق', 'Hotel'),
(8, 7, 'پەروەردەیی', 'تعليمي', 'Educational'),
(9, 7, 'کلتوری / گشتی', 'ثقافي / عام', 'Cultural / Public'),
(10, 7, 'تەندروستی و کات بەسەربردن', 'العافية والترفيه', 'Wellness and Entertainment'),
(11, 6, 'نیشتەجێبوون', 'سكني', 'Residential'),
(12, 6, 'بازرگانی', 'تجاري', 'Commercial'),
(13, 6, 'نوێکردنەوەی ڕووکار', 'تعديل الواجهة', 'Retrofit Facade'),
(14, 6, 'کلتوری / گشتی', 'ثقافي / عام', 'Cultural / Public'),
(15, 6, 'دەرەوەی چاودێری تەندروستی', 'واجهات الرعاية الصحية', 'Health Care Exteriors');

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` varchar(36) NOT NULL ,
  `name_ku` varchar(255) NOT NULL,
  `position_ku` varchar(255) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `position_ar` varchar(255) NOT NULL,
  `name_en` varchar(255) NOT NULL,
  `name_ar` varchar(255) NOT NULL,
  `position_en` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `teams`
--

INSERT INTO `teams` (`id`, `name_ku`, `position_ku`, `image_url`, `position_ar`, `name_en`, `name_ar`, `position_en`) VALUES
('6a88c418-ab97-11f0-b9f9-a30f62be92a0', 'بەرهەم', 'cofounder', 'https://cloud.mirkokawa.dev/api/public/csk_9384d0f7217211b7d537980ab1bd156c6af4027ac57ef67a9461589be6a329a4/24e77e59-3670-4f41-b829-121ddc6e6c6a', 'cofounder', 'barham', 'بەرهەم', 'cofounder');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
('410544b2-4001-4271-9855-fec4b6a6442a', 'User', 'admin@valuearch.com', '$2a$12$camkEwiGMJ.berU5isQBm.TiK79bhkLAqDLJVC8EtKSNUywJyTrUG');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `about_stats`
--
ALTER TABLE `about_stats`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `stat_key` (`stat_key`);

--
-- Indexes for table `audios`
--
ALTER TABLE `audios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_is_active` (`is_active`),
  ADD KEY `idx_use_for` (`use_for`);

--
-- Indexes for table `banners`
--
ALTER TABLE `banners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `countries`
--
ALTER TABLE `countries`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_name_en` (`name_en`),
  ADD KEY `idx_name_en` (`name_en`),
  ADD KEY `idx_code` (`code`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `footer_properties`
--
ALTER TABLE `footer_properties`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `property_key` (`property_key`);

--
-- Indexes for table `galleries`
--
ALTER TABLE `galleries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `graphics`
--
ALTER TABLE `graphics`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locations`
--
ALTER TABLE `locations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_city_en` (`city_en`),
  ADD KEY `idx_country_id` (`country_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_groups`
--
ALTER TABLE `product_groups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `projects_ibfk_1` (`project_category`),
  ADD KEY `idx_location_id` (`location_id`);

--
-- Indexes for table `project_categories`
--
ALTER TABLE `project_categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `properties`
--
ALTER TABLE `properties`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quotes`
--
ALTER TABLE `quotes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `revenue`
--
ALTER TABLE `revenue`
  ADD PRIMARY KEY (`month`),
  ADD UNIQUE KEY `month` (`month`);

--
-- Indexes for table `social_media`
--
ALTER TABLE `social_media`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `special_projects`
--
ALTER TABLE `special_projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sort_order` (`sort_order`);

--
-- Indexes for table `sub_categorys`
--
ALTER TABLE `sub_categorys`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `about_stats`
--
ALTER TABLE `about_stats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `countries`
--
ALTER TABLE `countries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `footer_properties`
--
ALTER TABLE `footer_properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `galleries`
--
ALTER TABLE `galleries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1215;

--
-- AUTO_INCREMENT for table `graphics`
--
ALTER TABLE `graphics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `locations`
--
ALTER TABLE `locations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `product_groups`
--
ALTER TABLE `product_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `project_categories`
--
ALTER TABLE `project_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `properties`
--
ALTER TABLE `properties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `quotes`
--
ALTER TABLE `quotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `sub_categorys`
--
ALTER TABLE `sub_categorys`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `locations`
--
ALTER TABLE `locations`
  ADD CONSTRAINT `fk_locations_country` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `fk_projects_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`project_category`) REFERENCES `project_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
