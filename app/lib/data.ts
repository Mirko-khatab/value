import {
  TeamField,
  CustomersTableType,
  InvoiceForm,
  Revenue,
  Blog,
  Machine,
  Product,
  Quote,
  SocialMedia,
  Property,
  SpecialProjects,
  Banner,
  Audio,
  ProjectCategory,
  Graphic,
  FooterProperty,
  Country,
  Location,
  Project,
  ParentType,
  Gallery,
} from "./definitions";
import { getConnection } from "./serverutils";

// Constants
const ITEMS_PER_PAGE = 12;

// Helper function to handle database connection errors gracefully
async function withDatabaseConnection<T>(
  operation: (connection: any) => Promise<T>,
  fallbackValue: T
): Promise<T> {
  let connection;
  try {
    connection = await getConnection();
    return await operation(connection);
  } catch (error) {
    console.warn("Database operation failed, returning fallback data:", error);
    return fallbackValue;
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (endError) {
        console.warn("Error closing database connection:", endError);
      }
    }
  }
}

// REVENUE DATA FETCHING
export async function fetchRevenue() {
  return withDatabaseConnection(async (connection) => {
    const [rows] = await connection.execute(`
        SELECT month, revenue FROM revenue
        ORDER BY month
      `);
    return rows as Revenue[];
  }, []);
}

// GRAPHICS DATA FETCHING
export async function fetchGraphics() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT id, image_url, created_at FROM graphics ORDER BY created_at DESC"
    );
    return rows as Graphic[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch graphics.");
  } finally {
    if (connection) await connection.end();
  }
}

// PROJECT CATEGORY DATA FETCHING
export async function fetchProjectCategories() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT id, title_ku, title_en, title_ar FROM project_categories ORDER BY id DESC"
    );
    return rows as ProjectCategory[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project categories.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchProjectCategoryById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT id, title_ku, title_en, title_ar FROM project_categories WHERE id = ?",
      [id]
    );
    return rows as ProjectCategory[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project category.");
  } finally {
    if (connection) await connection.end();
  }
}

// COUNTRIES DATA FETCHING
export async function fetchCountries() {
  let connection;
  try {
    connection = await getConnection();
    const [countries] = await connection.execute(
      "SELECT * FROM countries ORDER BY name_en ASC"
    );
    return countries as Country[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch countries.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchCountryById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [countries] = await connection.execute(
      "SELECT * FROM countries WHERE id = ?",
      [id]
    );
    const countryArray = countries as Country[];
    return countryArray[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch country.");
  } finally {
    if (connection) await connection.end();
  }
}

// LOCATIONS DATA FETCHING
export async function fetchLocations() {
  let connection;
  try {
    connection = await getConnection();
    const [locations] = await connection.execute(
      "SELECT l.*, c.name_en as country_name FROM locations l LEFT JOIN countries c ON l.country_id = c.id ORDER BY l.city_en ASC"
    );
    return locations as Location[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch locations.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchLocationById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [locations] = await connection.execute(
      "SELECT * FROM locations WHERE id = ?",
      [id]
    );
    const locationArray = locations as Location[];
    return locationArray[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch location.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchLocationsByCountry(countryId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [locations] = await connection.execute(
      "SELECT * FROM locations WHERE country_id = ? ORDER BY city_en ASC",
      [countryId]
    );
    return locations as Location[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch locations by country.");
  } finally {
    if (connection) await connection.end();
  }
}

// PROJECTS DATA FETCHING
export async function fetchProjects() {
  let connection;
  try {
    connection = await getConnection();
    const [projects] = await connection.execute(
      `
      SELECT 
        p.*,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        l.city_en as location_city_en,
        l.city_ku as location_city_ku,
        l.city_ar as location_city_ar,
        c.name_en as location_country_name_en,
        c.name_ku as location_country_name_ku,
        c.name_ar as location_country_name_ar,
        g.image_url as gallery_image_url,
        g.alt_text as gallery_alt_text,
        g.order_index as gallery_order_index
      FROM projects p
      LEFT JOIN project_categories pc ON p.project_category = pc.id
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN countries c ON l.country_id = c.id
      LEFT JOIN galleries g ON CAST(g.parent_id AS CHAR) = CAST(p.id AS CHAR) 
        AND CAST(g.parent_type AS CHAR) = CAST(? AS CHAR)
        AND g.order_index = (
          SELECT MIN(CAST(g2.order_index AS UNSIGNED))
          FROM galleries g2
          WHERE CAST(g2.parent_id AS CHAR) = CAST(p.id AS CHAR)
            AND CAST(g2.parent_type AS CHAR) = CAST(? AS CHAR)
        )
      ORDER BY p.date DESC
    `,
      [ParentType.Project.toString(), ParentType.Project.toString()]
    );
    return projects as Project[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch projects.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchProjectById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [projects] = await connection.execute(
      `
      SELECT 
        p.*,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        l.city_en as location_city_en,
        l.city_ku as location_city_ku,
        l.city_ar as location_city_ar,
        c.name_en as location_country_name_en,
        c.name_ku as location_country_name_ku,
        c.name_ar as location_country_name_ar
      FROM projects p
      LEFT JOIN project_categories pc ON p.project_category = pc.id
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN countries c ON l.country_id = c.id
      WHERE p.id = ?
    `,
      [id]
    );
    const projectArray = projects as Project[];
    return projectArray;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredProjects(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;

  let connection;
  try {
    connection = await getConnection();
    const [projects] = await connection.execute(
      `SELECT 
        p.*,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        l.city_en as location_city_en,
        l.city_ku as location_city_ku,
        l.city_ar as location_city_ar,
        c.name_en as location_country_name_en,
        c.name_ku as location_country_name_ku,
        c.name_ar as location_country_name_ar,
        g.image_url as gallery_image_url,
        g.alt_text as gallery_alt_text,
        g.order_index as gallery_order_index
      FROM projects p
      LEFT JOIN project_categories pc ON p.project_category = pc.id
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN countries c ON l.country_id = c.id
      LEFT JOIN galleries g ON CAST(g.parent_id AS CHAR) = CAST(p.id AS CHAR) 
        AND CAST(g.parent_type AS CHAR) = CAST(? AS CHAR)
        AND g.order_index = (
          SELECT MIN(CAST(g2.order_index AS UNSIGNED))
          FROM galleries g2
          WHERE CAST(g2.parent_id AS CHAR) = CAST(p.id AS CHAR)
            AND CAST(g2.parent_type AS CHAR) = CAST(? AS CHAR)
        )
      WHERE 
        p.title_en LIKE ? OR 
        p.title_ku LIKE ? OR 
        p.title_ar LIKE ?
      ORDER BY p.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [
        ParentType.Project.toString(),
        ParentType.Project.toString(),
        searchTerm,
        searchTerm,
        searchTerm,
      ]
    );
    return projects as Project[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered projects.");
  } finally {
    if (connection) await connection.end();
  }
}

// Count total pages for projects with search
export async function countProjectPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(*) as total FROM projects p 
       WHERE p.title_en LIKE ? OR p.title_ku LIKE ? OR p.title_ar LIKE ?`,
      [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`]
    );
    const count = (result as any[])[0].total;
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    return 1; // Return 1 page as fallback
  } finally {
    if (connection) await connection.end();
  }
}

// PROJECT GALLERIES DATA FETCHING
export async function fetchProjectGalleriesData(projectId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [galleries] = await connection.execute(
      "SELECT * FROM galleries WHERE CAST(parent_id AS CHAR) = CAST(? AS CHAR) AND CAST(parent_type AS CHAR) = CAST(? AS CHAR) ORDER BY CAST(order_index AS UNSIGNED) ASC",
      [projectId, ParentType.Project.toString()]
    );
    return galleries as Gallery[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project galleries.");
  } finally {
    if (connection) await connection.end();
  }
}

// PRODUCTS DATA FETCHING
export async function fetchProducts() {
  let connection;
  try {
    connection = await getConnection();
    const [products] = await connection.execute(
      `SELECT 
        p.*,
        g.image_url as gallery_image_url,
        g.alt_text as gallery_alt_text,
        g.order_index as gallery_order_index
      FROM products p
      LEFT JOIN galleries g ON CAST(g.parent_id AS CHAR) = CAST(p.id AS CHAR) 
        AND CAST(g.parent_type AS CHAR) = CAST(? AS CHAR)
        AND g.order_index = (
          SELECT MIN(CAST(g2.order_index AS UNSIGNED))
          FROM galleries g2
          WHERE CAST(g2.parent_id AS CHAR) = CAST(p.id AS CHAR)
            AND CAST(g2.parent_type AS CHAR) = CAST(? AS CHAR)
        )
      ORDER BY p.id DESC`,
      [ParentType.Product.toString(), ParentType.Product.toString()]
    );
    return products as Product[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchProductById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [products] = await connection.execute(
      "SELECT * FROM products WHERE id = ?",
      [id]
    );
    const productArray = products as Product[];
    return productArray;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredProducts(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;

  let connection;
  try {
    connection = await getConnection();
    const [products] = await connection.execute(
      `SELECT 
        p.*,
        g.image_url as gallery_image_url,
        g.alt_text as gallery_alt_text,
        g.order_index as gallery_order_index
      FROM products p
      LEFT JOIN galleries g ON CAST(g.parent_id AS CHAR) = CAST(p.id AS CHAR) 
        AND CAST(g.parent_type AS CHAR) = CAST(? AS CHAR)
        AND g.order_index = (
          SELECT MIN(CAST(g2.order_index AS UNSIGNED))
          FROM galleries g2
          WHERE CAST(g2.parent_id AS CHAR) = CAST(p.id AS CHAR)
            AND CAST(g2.parent_type AS CHAR) = CAST(? AS CHAR)
        )
      WHERE 
        p.title_en LIKE ? OR 
        p.title_ku LIKE ? OR 
        p.title_ar LIKE ? OR
        p.description_en LIKE ? OR
        p.description_ku LIKE ? OR
        p.description_ar LIKE ?
      ORDER BY p.id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [
        ParentType.Product.toString(),
        ParentType.Product.toString(),
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
      ]
    );
    return products as Product[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered products.");
  } finally {
    if (connection) await connection.end();
  }
}

// Count total pages for products with search
export async function fetchTotalProductsPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(*) as total FROM products p 
       WHERE p.title_en LIKE ? OR p.title_ku LIKE ? OR p.title_ar LIKE ?
          OR p.description_en LIKE ? OR p.description_ku LIKE ? OR p.description_ar LIKE ?`,
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
      ]
    );
    const count = (result as any[])[0].total;
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    return 1; // Return 1 page as fallback
  } finally {
    if (connection) await connection.end();
  }
}

// PRODUCT GALLERIES DATA FETCHING
export async function fetchProductGalleries(productId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [galleries] = await connection.execute(
      "SELECT * FROM galleries WHERE CAST(parent_id AS CHAR) = CAST(? AS CHAR) AND CAST(parent_type AS CHAR) = CAST(? AS CHAR) ORDER BY CAST(order_index AS UNSIGNED) ASC",
      [productId, ParentType.Product.toString()]
    );
    return galleries as Gallery[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product galleries.");
  } finally {
    if (connection) await connection.end();
  }
}

// SOCIAL MEDIA DATA FETCHING
export async function fetchSocialMedia() {
  let connection;
  try {
    connection = await getConnection();
    const [socialMedia] = await connection.execute(
      "SELECT * FROM social_media ORDER BY id ASC"
    );
    return socialMedia as SocialMedia[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch social media.");
  } finally {
    if (connection) await connection.end();
  }
}

// FOOTER PROPERTIES DATA FETCHING
export async function fetchFooterProperties() {
  let connection;
  try {
    connection = await getConnection();
    const [properties] = await connection.execute(
      "SELECT * FROM properties WHERE `key` LIKE 'footer_%' ORDER BY `key` ASC"
    );
    return properties as Property[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch footer properties.");
  } finally {
    if (connection) await connection.end();
  }
}

// ABOUT STATS DATA FETCHING (using properties table)
export async function fetchAboutStats() {
  let connection;
  try {
    connection = await getConnection();
    const [stats] = await connection.execute(
      "SELECT * FROM properties WHERE `key` LIKE 'about_%' AND `key` NOT LIKE '%_label' ORDER BY `key` ASC"
    );
    return stats as Property[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch about stats.");
  } finally {
    if (connection) await connection.end();
  }
}
