import bcrypt from "bcrypt";
import mysql from "mysql2/promise";
import { invoices, customers, revenue, users } from "../lib/placeholder-data";

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
}

async function seedUsers(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await connection.execute(
      `INSERT INTO users (id, name, email, password) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [user.id, user.name, user.email, hashedPassword]
    );
  }
}

async function seedInvoices(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS invoices (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      customer_id VARCHAR(36) NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL
    )
  `);

  for (const invoice of invoices) {
    await connection.execute(
      `INSERT INTO invoices (customer_id, amount, status, date) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE amount=VALUES(amount)`,
      [invoice.customer_id, invoice.amount, invoice.status, invoice.date]
    );
  }
}

async function seedCustomers(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS customers (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL
    )
  `);

  for (const customer of customers) {
    await connection.execute(
      `INSERT INTO customers (id, name, email, image_url) 
       VALUES (?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE name=VALUES(name)`,
      [customer.id, customer.name, customer.email, customer.image_url]
    );
  }
}

async function seedRevenue(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL,
      PRIMARY KEY (month)
    )
  `);

  for (const rev of revenue) {
    await connection.execute(
      `INSERT INTO revenue (month, revenue) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE revenue=VALUES(revenue)`,
      [rev.month, rev.revenue]
    );
  }
}

async function seedMachineGroups(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS machine_groups (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title_ku VARCHAR(255) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL
    )
  `);

  // Insert sample machine groups
  const sampleGroups = [
    {
      title_ku: "ئامێرەکانی کشتوکاڵ",
      title_ar: "آلات الزراعة",
      title_en: "Agricultural Machinery",
    },
    {
      title_ku: "ئامێرەکانی بیناسازی",
      title_ar: "آلات البناء",
      title_en: "Construction Equipment",
    },
    {
      title_ku: "ئامێرەکانی پیشەسازی",
      title_ar: "آلات الصناعة",
      title_en: "Industrial Machinery",
    },
  ];

  for (const group of sampleGroups) {
    await connection.execute(
      `INSERT INTO machine_groups (title_ku, title_ar, title_en) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE title_ku=VALUES(title_ku)`,
      [group.title_ku, group.title_ar, group.title_en]
    );
  }
}

async function seedMachines(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS machines (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      machine_group_id VARCHAR(36) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      title_ku VARCHAR(255) NOT NULL,
      description_ar TEXT NOT NULL,
      description_en TEXT NOT NULL,
      description_ku TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (machine_group_id) REFERENCES machine_groups(id) ON DELETE CASCADE
    )
  `);
}

async function seedGalleries(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS galleries (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      parent_id VARCHAR(36) NOT NULL,
      parent_type INT NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      alt_text VARCHAR(255) NOT NULL,
      order_index VARCHAR(10) NOT NULL DEFAULT '1',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function seedBlogs(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS blogs (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title_ku VARCHAR(255) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      description_ku TEXT NOT NULL,
      description_ar TEXT NOT NULL,
      description_en TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function seedProjects(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title_ku VARCHAR(255) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      description_ku TEXT NOT NULL,
      description_ar TEXT NOT NULL,
      description_en TEXT NOT NULL,
      date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function seedTeams(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS teams (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      name_ku VARCHAR(255) NOT NULL,
      name_ar VARCHAR(255) NOT NULL,
      name_en VARCHAR(255) NOT NULL,
      position_ku VARCHAR(255) NOT NULL,
      position_ar VARCHAR(255) NOT NULL,
      position_en VARCHAR(255) NOT NULL,
      image_url VARCHAR(500),
      special VARCHAR(255) DEFAULT 'regular',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function seedQuotes(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS quotes (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title_ku VARCHAR(255) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      description_ku TEXT NOT NULL,
      description_ar TEXT NOT NULL,
      description_en TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Insert sample quotes
  const sampleQuotes = [
    {
      title_ku: "کەسێک کە بەردەوام بەدوای گەشەپێدانە",
      title_ar: "شخص يسعى دائماً للتطوير",
      title_en: "A person who constantly seeks development",
      description_ku: "کەسێک کە بەردەوام بەدوای گەشەپێدانە و باشترکردنی خۆیەتی",
      description_ar: "شخص يسعى دائماً للتطوير وتحسين نفسه",
      description_en:
        "A person who constantly seeks development and self-improvement",
    },
    {
      title_ku: "هەموو شتێک لە کاتی خۆیدا",
      title_ar: "كل شيء في وقته",
      title_en: "Everything in its time",
      description_ku: "هەموو شتێک لە کاتی خۆیدا باشترە",
      description_ar: "كل شيء في وقته أفضل",
      description_en: "Everything is better in its own time",
    },
  ];

  for (const quote of sampleQuotes) {
    await connection.execute(
      `INSERT INTO quotes (title_ku, title_ar, title_en, description_ku, description_ar, description_en) 
       VALUES (?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE title_ku=VALUES(title_ku)`,
      [
        quote.title_ku,
        quote.title_ar,
        quote.title_en,
        quote.description_ku,
        quote.description_ar,
        quote.description_en,
      ]
    );
  }
}

async function seedSocialMedia(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS social_media (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      type INT NOT NULL,
      url VARCHAR(500) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Insert sample social media
  const sampleSocialMedia = [
    {
      type: 0, // Instagram
      url: "https://instagram.com/yourcompany",
    },
    {
      type: 1, // Facebook
      url: "https://facebook.com/yourcompany",
    },
    {
      type: 2, // X (Twitter)
      url: "https://x.com/yourcompany",
    },
  ];

  for (const social of sampleSocialMedia) {
    await connection.execute(
      `INSERT INTO social_media (type, url) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE url=VALUES(url)`,
      [social.type, social.url]
    );
  }
}

async function seedSpecialProjects(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS special_projects (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      image_url VARCHAR(500) NOT NULL,
      sort_order INT NOT NULL DEFAULT 0 UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
}

async function seedBanners(connection: mysql.Connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS banners (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      title_ku VARCHAR(255) NOT NULL,
      title_ar VARCHAR(255) NOT NULL,
      title_en VARCHAR(255) NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      video_url VARCHAR(500) DEFAULT '',
      type ENUM('image', 'video') NOT NULL DEFAULT 'image',
      is_active BOOLEAN NOT NULL DEFAULT true,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // Insert sample banners
  const sampleBanners = [
    {
      title_ku: "بەرنامەیەکی نوێ",
      title_ar: "برنامج جديد",
      title_en: "New Program",
      image_url: "/image/2.jpg",
      video_url: "",
      type: "image",
      is_active: true,
      sort_order: 1,
    },
    {
      title_ku: "پڕۆژەی گەورە",
      title_ar: "مشروع كبير",
      title_en: "Big Project",
      image_url: "/image/barham.jpg",
      video_url: "",
      type: "image",
      is_active: true,
      sort_order: 2,
    },
  ];

  for (const banner of sampleBanners) {
    await connection.execute(
      `INSERT INTO banners (title_ku, title_ar, title_en, image_url, video_url, type, is_active, sort_order) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE title_ku=VALUES(title_ku)`,
      [
        banner.title_ku,
        banner.title_ar,
        banner.title_en,
        banner.image_url,
        banner.video_url,
        banner.type,
        banner.is_active,
        banner.sort_order,
      ]
    );
  }
}

export async function GET() {
  let connection;

  try {
    connection = await getConnection();

    await seedUsers(connection);
    await seedCustomers(connection);
    await seedInvoices(connection);
    await seedRevenue(connection);
    await seedSpecialProjects(connection);
    await seedBanners(connection);

    return Response.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seeding error:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
