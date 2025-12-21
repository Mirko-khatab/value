import {
  TeamField,
  CustomersTableType,
  InvoiceForm,
  Revenue,
  Event,
  Machine,
  Product,
  Quote,
  SocialMedia,
  Property,
  SpecialProjects,
  Banner,
  Audio,
  ProjectCategory,
  SubCategory,
  Graphic,
  FooterProperty,
  Country,
  Location,
  Project,
  ParentType,
  Gallery,
  Customer,
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

// SUB CATEGORY DATA FETCHING
export async function fetchSubCategories() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT sc.id, sc.category_id, sc.title_ku, sc.title_en, sc.title_ar,
              pc.title_en as category_name_en,
              pc.title_ku as category_name_ku,
              pc.title_ar as category_name_ar
       FROM sub_categorys sc
       LEFT JOIN project_categories pc ON sc.category_id = pc.id
       ORDER BY sc.id DESC`
    );
    return rows as SubCategory[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch sub categories.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchSubCategoryById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT sc.id, sc.category_id, sc.title_ku, sc.title_en, sc.title_ar,
              pc.title_en as category_name_en,
              pc.title_ku as category_name_ku,
              pc.title_ar as category_name_ar
       FROM sub_categorys sc
       LEFT JOIN project_categories pc ON sc.category_id = pc.id
       WHERE sc.id = ?`,
      [id]
    );
    return rows as SubCategory[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch sub category.");
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
    const parentType = ParentType.Project.toString();
    const [projects] = await connection.execute(
      `
      SELECT 
        p.*,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        sc.title_en as sub_category_name_en,
        sc.title_ku as sub_category_name_ku,
        sc.title_ar as sub_category_name_ar,
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
      LEFT JOIN sub_categorys sc ON p.project_sub_category = sc.id
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN countries c ON l.country_id = c.id
      LEFT JOIN galleries g ON g.parent_id = p.id 
        AND g.parent_type = ?
        AND g.order_index = (
          SELECT MIN(g2.order_index)
          FROM galleries g2
          WHERE g2.parent_id = p.id
            AND g2.parent_type = ?
        )
      WHERE p.is_published = 1
      ORDER BY p.date DESC, p.id DESC
    `,
      [parentType, parentType]
    );
    return (projects as Project[]) || [];
  } catch (error) {
    console.error("Database Error in fetchProjects:", error);
    // Return empty array instead of throwing
    return [];
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.warn("Error closing connection:", closeError);
      }
    }
  }
}

export async function fetchProjectsPaginated(
  page: number = 1,
  limit: number = 12
) {
  let connection;
  try {
    connection = await getConnection();
    const offset = (page - 1) * limit;

    // Get total count for hasMore calculation
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM projects WHERE is_published = 1"
    );
    const total = (countResult as any)[0]?.total || 0;

    // Return empty result if no projects
    if (total === 0) {
      return {
        data: [],
        hasMore: false,
        total: 0,
        page,
        limit,
      };
    }

    // Fetch paginated projects
    const parentType = ParentType.Project.toString();
    // Use string interpolation for LIMIT/OFFSET as MySQL execute() doesn't support them as parameters
    const [projects] = await connection.execute(
      `
      SELECT 
        p.*,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        sc.title_en as sub_category_name_en,
        sc.title_ku as sub_category_name_ku,
        sc.title_ar as sub_category_name_ar,
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
      LEFT JOIN sub_categorys sc ON p.project_sub_category = sc.id
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN countries c ON l.country_id = c.id
      LEFT JOIN galleries g ON g.parent_id = p.id 
        AND g.parent_type = ?
        AND g.order_index = (
          SELECT MIN(g2.order_index)
          FROM galleries g2
          WHERE g2.parent_id = p.id
            AND g2.parent_type = ?
        )
      WHERE p.is_published = 1
      ORDER BY p.date DESC, p.id DESC
      LIMIT ${parseInt(String(limit))} OFFSET ${parseInt(String(offset))}
    `,
      [parentType, parentType]
    );

    const hasMore = offset + limit < total;

    return {
      data: (projects as Project[]) || [],
      hasMore,
      total,
      page,
      limit,
    };
  } catch (error) {
    console.error("Database Error in fetchProjectsPaginated:", error);
    // Return empty result instead of throwing error
    return {
      data: [],
      hasMore: false,
      total: 0,
      page,
      limit,
    };
  } finally {
    if (connection) {
      try {
        await connection.end();
      } catch (closeError) {
        console.warn("Error closing connection:", closeError);
      }
    }
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
        sc.title_en as sub_category_name_en,
        sc.title_ku as sub_category_name_ku,
        sc.title_ar as sub_category_name_ar,
        l.city_en as location_city_en,
        l.city_ku as location_city_ku,
        l.city_ar as location_city_ar,
        c.name_en as location_country_name_en,
        c.name_ku as location_country_name_ku,
        c.name_ar as location_country_name_ar
      FROM projects p
      LEFT JOIN project_categories pc ON p.project_category = pc.id
      LEFT JOIN sub_categorys sc ON p.project_sub_category = sc.id
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
    const parentType = ParentType.Project.toString();
    const [projects] = await connection.execute(
      `SELECT 
        p.*,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        sc.title_en as sub_category_name_en,
        sc.title_ku as sub_category_name_ku,
        sc.title_ar as sub_category_name_ar,
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
      LEFT JOIN sub_categorys sc ON p.project_sub_category = sc.id
      LEFT JOIN locations l ON p.location_id = l.id
      LEFT JOIN countries c ON l.country_id = c.id
      LEFT JOIN galleries g ON g.parent_id = p.id 
        AND g.parent_type = ?
        AND g.order_index = (
          SELECT MIN(g2.order_index)
          FROM galleries g2
          WHERE g2.parent_id = p.id
            AND g2.parent_type = ?
        )
      WHERE 
        p.title_en LIKE ? OR 
        p.title_ku LIKE ? OR 
        p.title_ar LIKE ?
      ORDER BY p.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [parentType, parentType, searchTerm, searchTerm, searchTerm]
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
    const parentType = ParentType.Project.toString();
    const [galleries] = await connection.execute(
      "SELECT * FROM galleries WHERE parent_id = ? AND parent_type = ? ORDER BY order_index ASC",
      [projectId, parentType]
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
    const parentType = ParentType.Product.toString();
    const [products] = await connection.execute(
      `SELECT 
        p.*,
        g.image_url as gallery_image_url,
        g.alt_text as gallery_alt_text,
        g.order_index as gallery_order_index
      FROM products p
      LEFT JOIN galleries g ON g.parent_id = p.id 
        AND g.parent_type = ?
        AND g.order_index = (
          SELECT MIN(g2.order_index)
          FROM galleries g2
          WHERE g2.parent_id = p.id
            AND g2.parent_type = ?
        )
      ORDER BY p.id DESC`,
      [parentType, parentType]
    );
    return products as Product[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchProductsPaginated(
  page: number = 1,
  limit: number = 12
) {
  let connection;
  try {
    connection = await getConnection();
    const offset = (page - 1) * limit;

    // Get total count for hasMore calculation
    const [countResult] = await connection.execute(
      "SELECT COUNT(*) as total FROM products"
    );
    const total = (countResult as any)[0].total;

    // Fetch paginated products
    const parentType = ParentType.Product.toString();
    // Use string interpolation for LIMIT/OFFSET as MySQL execute() doesn't support them as parameters
    const [products] = await connection.execute(
      `SELECT 
        p.*,
        g.image_url as gallery_image_url,
        g.alt_text as gallery_alt_text,
        g.order_index as gallery_order_index
      FROM products p
      LEFT JOIN galleries g ON g.parent_id = p.id 
        AND g.parent_type = ?
        AND g.order_index = (
          SELECT MIN(g2.order_index)
          FROM galleries g2
          WHERE g2.parent_id = p.id
            AND g2.parent_type = ?
        )
      ORDER BY p.id DESC
      LIMIT ${parseInt(String(limit))} OFFSET ${parseInt(String(offset))}`,
      [parentType, parentType]
    );

    const hasMore = offset + limit < total;

    return {
      data: products as Product[],
      hasMore,
      total,
      page,
      limit,
    };
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
    const parentType = ParentType.Product.toString();
    const [products] = await connection.execute(
      `SELECT 
        p.*,
        g.image_url as gallery_image_url,
        g.alt_text as gallery_alt_text,
        g.order_index as gallery_order_index
      FROM products p
      LEFT JOIN galleries g ON g.parent_id = p.id 
        AND g.parent_type = ?
        AND g.order_index = (
          SELECT MIN(g2.order_index)
          FROM galleries g2
          WHERE g2.parent_id = p.id
            AND g2.parent_type = ?
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
        parentType,
        parentType,
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

//team

export async function fetchTotalTeamsPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      "SELECT COUNT(*) as total FROM teams WHERE name_en LIKE ? OR name_ku LIKE ? OR name_ar LIKE ?",
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

//fetchCustomers
export async function fetchCustomers() {
  let connection;
  try {
    connection = await getConnection();
    const [customers] = await connection.execute(
      "SELECT * FROM teams ORDER BY id DESC"
    );
    return customers as Customer[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch teams.");
  } finally {
    if (connection) await connection.end();
  }
}

//fetchTeams
export async function fetchTeams() {
  let connection;
  try {
    connection = await getConnection();
    const [teams] = await connection.execute(
      "SELECT * FROM teams ORDER BY id DESC"
    );
    return teams as TeamField[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch teams.");
  } finally {
    if (connection) await connection.end();
  }
}

//fetchTeamById
export async function fetchTeamById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [teams] = await connection.execute(
      "SELECT * FROM teams WHERE id = ?",
      [id]
    );
    return teams as TeamField[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch team.");
  } finally {
    if (connection) await connection.end();
  }
}
// PRODUCT GALLERIES DATA FETCHING
export async function fetchProductGalleries(productId: string) {
  let connection;
  try {
    connection = await getConnection();
    const parentType = ParentType.Product.toString();
    const [galleries] = await connection.execute(
      "SELECT * FROM galleries WHERE parent_id = ? AND parent_type = ? ORDER BY order_index ASC",
      [productId, parentType]
    );
    return galleries as Gallery[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product galleries.");
  } finally {
    if (connection) await connection.end();
  }
}

// BLOG/EVENT DATA FETCHING
export async function fetchEventById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [events] = await connection.execute(
      "SELECT * FROM event WHERE id = ?",
      [id]
    );
    const eventArray = events as Event[];
    return eventArray;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch event.");
  } finally {
    if (connection) await connection.end();
  }
}

// BLOG/EVENT GALLERIES DATA FETCHING
export async function fetchEventGalleries(eventId: string) {
  let connection;
  try {
    connection = await getConnection();
    const parentType = ParentType.Event.toString();
    const [galleries] = await connection.execute(
      "SELECT * FROM galleries WHERE parent_id = ? AND parent_type = ? ORDER BY order_index ASC",
      [eventId, parentType]
    );
    return galleries as Gallery[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch blog/event galleries.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredEvents(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;

  let connection;
  try {
    connection = await getConnection();
    const parentType = ParentType.Event.toString();
    const [events] = await connection.execute(
      `SELECT 
        e.*,
        g.image_url as gallery_image_url,
        g.alt_text as gallery_alt_text,
        g.order_index as gallery_order_index
      FROM event e
      LEFT JOIN galleries g ON g.parent_id = e.id 
        AND g.parent_type = ?
        AND g.order_index = (
          SELECT MIN(g2.order_index)
          FROM galleries g2
          WHERE g2.parent_id = e.id
            AND g2.parent_type = ?
        )
      WHERE 
        e.title_en LIKE ? OR 
        e.title_ku LIKE ? OR 
        e.title_ar LIKE ? OR
        e.description_en LIKE ? OR
        e.description_ku LIKE ? OR
        e.description_ar LIKE ?
        ORDER BY e.id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [
        parentType,
        parentType,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
        searchTerm,
      ]
    );
    return events as Event[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered events.");
  } finally {
    if (connection) await connection.end();
  }
}

// Count total pages for blogs/events with search
export async function fetchTotalEventsPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(*) as total FROM event e 
       WHERE e.title_en LIKE ? OR e.title_ku LIKE ? OR e.title_ar LIKE ?
          OR e.description_en LIKE ? OR e.description_ku LIKE ? OR e.description_ar LIKE ?`,
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

// id
// title_ku
// title_en
// title_ar
// audio_url
// is_active
// use_for
// created_at
// updated_at

// fetchFilteredAudios,
export async function fetchFilteredAudios(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;
  let connection;
  try {
    connection = await getConnection();
    const [audios] = await connection.execute(
      `SELECT * FROM audios WHERE title_en LIKE ? OR title_ku LIKE ? OR title_ar LIKE ? ORDER BY id DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [searchTerm, searchTerm, searchTerm]
    );
    return audios as Audio[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered audios.");
  } finally {
    if (connection) await connection.end();
  }
}

// fetchTotalAudiosPages
export async function fetchTotalAudiosPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(*) as total FROM audios WHERE title_en LIKE ? OR title_ku LIKE ? OR title_ar LIKE ?`,
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
//fetchAudioById
export async function fetchAudioById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [audio] = await connection.execute(
      `SELECT * FROM audios WHERE id = ?`,
      [id]
    );

    const audioArray = audio as Audio[];
    return audioArray[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch audio by id from database.");
  } finally {
    if (connection) await connection.end();
  }
}

//fetchFilteredProperties
export async function fetchFilteredProperties(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;
  let connection;
  try {
    connection = await getConnection();
    const [properties] = await connection.execute(
      `SELECT * FROM properties WHERE \`key\` LIKE ? ORDER BY id DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [searchTerm]
    );
    return properties as Property[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered properties from database.");
  } finally {
    if (connection) await connection.end();
  }
}

//fetchTotalPropertiesPages
export async function fetchTotalPropertiesPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(*) as total FROM properties WHERE \`key\` LIKE ?`,
      [`%${searchQuery}%`]
    );
    const count = (result as any[])[0].total;
    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total properties pages.");
  } finally {
    if (connection) await connection.end();
  }
}

//fetchPropertyById
export async function fetchPropertyById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [property] = await connection.execute(
      `SELECT * FROM properties WHERE id = ?`,
      [id]
    );
    const propertyArray = property as Property[];
    return propertyArray[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch property by id from database.");
  } finally {
    if (connection) await connection.end();
  }
}

// fetchTotalSocialMediaPages
export async function fetchTotalSocialMediaPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(*) as total FROM social_media WHERE type LIKE ? OR url LIKE ?`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
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

// fetchSocialMediaById
export async function fetchSocialMediaById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [socialMedia] = await connection.execute(
      `SELECT * FROM social_media WHERE id = ?`,
      [id]
    );
    const socialMediaArray = socialMedia as SocialMedia[];
    return socialMediaArray[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch social media by id from database.");
  } finally {
    if (connection) await connection.end();
  }
}

// fetchFilteredSocialMedia
export async function fetchFilteredSocialMedia(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;
  let connection;
  try {
    connection = await getConnection();
    const [socialMedia] = await connection.execute(
      `SELECT * FROM social_media WHERE type LIKE ? OR url LIKE ? ORDER BY id DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [searchTerm, searchTerm]
    );
    const socialMediaArray = socialMedia as SocialMedia[];
    return socialMediaArray;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered social media.");
  } finally {
    if (connection) await connection.end();
  }
}

// fetchFilteredQuotes
export async function fetchFilteredQuotes(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;
  let connection;
  try {
    connection = await getConnection();
    const [quotes] = await connection.execute(
      `SELECT * FROM quotes WHERE title_en LIKE ? OR title_ku LIKE ? OR title_ar LIKE ? ORDER BY id DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [searchTerm, searchTerm, searchTerm]
    );
    return quotes as Quote[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered quotes.");
  } finally {
    if (connection) await connection.end();
  }
}

//fetchTotalQuotesPages
export async function fetchTotalQuotesPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(*) as total FROM quotes WHERE title_en LIKE ? OR title_ku LIKE ? OR title_ar LIKE ?`,
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

// fetchQuotes
export async function fetchQuotes() {
  let connection;
  try {
    connection = await getConnection();
    const [quotes] = await connection.execute(
      `SELECT * FROM quotes ORDER BY id DESC`
    );
    return quotes as Quote[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quotes.");
  } finally {
    if (connection) await connection.end();
  }
}

// fetchQuoteById
export async function fetchQuoteById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [quote] = await connection.execute(
      `SELECT * FROM quotes WHERE id = ?`,
      [id]
    );
    const quoteArray = quote as Quote[];
    return quoteArray[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quote by id from database.");
  } finally {
    if (connection) await connection.end();
  }
}

// fetchBannerById
export async function fetchBannerById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [banner] = await connection.execute(
      `SELECT * FROM banners WHERE id = ?`,
      [id]
    );
    return banner as Banner[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch banner by id from database.");
  } finally {
    if (connection) await connection.end();
  }
}

// fetchFilteredBanners
export async function fetchFilteredBanners(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const searchTerm = `%${query}%`;
  let connection;
  try {
    connection = await getConnection();
    const [banners] = await connection.execute(
      `SELECT * FROM banners WHERE title_en LIKE ? OR title_ku LIKE ? OR title_ar LIKE ? ORDER BY sort_order ASC, id DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [searchTerm, searchTerm, searchTerm]
    );
    return banners as Banner[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered banners.");
  } finally {
    if (connection) await connection.end();
  }
}

// fetchTotalBannersPages
export async function fetchTotalBannersPages(searchQuery: string) {
  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      `SELECT COUNT(*) as total FROM banners WHERE title_en LIKE ? OR title_ku LIKE ? OR title_ar LIKE ?`,
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
