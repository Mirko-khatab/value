-- Sample Audio Data (Optional - for testing purposes)
-- Replace the audio_url with your actual S3 URL after uploading

-- Example: Landing Page Background Music
INSERT INTO `audios` (
  `id`,
  `title_ku`,
  `title_en`,
  `title_ar`,
  `audio_url`,
  `is_active`,
  `use_for`
) VALUES (
  UUID(),
  'میوزیکی پێشوەکی',
  'Landing Page Music',
  'موسيقى الصفحة الرئيسية',
  'https://your-cloudfront-domain.cloudfront.net/customers/your-audio-file.mp3',
  TRUE,
  'landing'
);

-- Example: Intro Music
INSERT INTO `audios` (
  `id`,
  `title_ku`,
  `title_en`,
  `title_ar`,
  `audio_url`,
  `is_active`,
  `use_for`
) VALUES (
  UUID(),
  'میوزیکی دەستپێک',
  'Intro Music',
  'موسيقى المقدمة',
  'https://your-cloudfront-domain.cloudfront.net/customers/your-intro-audio.mp3',
  TRUE,
  'intro'
);

-- Example: Music for Both Landing and Intro
INSERT INTO `audios` (
  `id`,
  `title_ku`,
  `title_en`,
  `title_ar`,
  `audio_url`,
  `is_active`,
  `use_for`
) VALUES (
  UUID(),
  'میوزیکی گشتی',
  'General Background Music',
  'موسيقى الخلفية العامة',
  'https://your-cloudfront-domain.cloudfront.net/customers/your-general-audio.mp3',
  TRUE,
  'both'
);

-- Note: 
-- 1. Replace the audio_url values with your actual S3/CloudFront URLs
-- 2. Only set ONE audio to active per use case for best results
-- 3. It's better to upload through the admin panel which handles S3 automatically

