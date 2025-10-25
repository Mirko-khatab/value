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
} from "./definitions";
import { getConnection } from "./serverutils";
import { Project } from "./definitions";
import { ParentType } from "./definitions";
import { Gallery } from "./definitions";

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

export async function fetchRevenue() {
  return withDatabaseConnection(
    async (connection) => {
      // Artificially delay a response for demo purposes.
      // Don't do this in production :)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const [rows] = await connection.execute("SELECT * FROM revenue");
      return rows as Revenue[];
    },
    [] // Return empty array as fallback
  );
}

export async function fetchTeamById(id: string) {
  return withDatabaseConnection(
    async (connection) => {
      const [rows] = await connection.execute(
        `SELECT * FROM teams WHERE id = ?`,
        [id]
      );
      return rows as TeamField[];
    },
    [] // Return empty array as fallback
  );
}

export async function fetchSpecialProjects() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
        SELECT * FROM special_projects
      `
    );
    return rows as SpecialProjects[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch special projects.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchProjectById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT projects.*, 
        pc.title_en as category_name,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        l.city_en as location_en,
        l.city_ku as location_ku,
        l.city_ar as location_ar,
        (SELECT image_url FROM galleries WHERE parent_id = projects.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = projects.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = projects.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM projects 
      LEFT JOIN project_categories pc ON projects.project_category = pc.id
      LEFT JOIN locations l ON projects.location_id = l.id
      WHERE projects.id = ?`,
      [id]
    );
    return rows as Project[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project.");
  } finally {
    if (connection) await connection.end();
  }
}

// export async function fetchLatestInvoices() {
//   let connection;
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     connection = await getConnection();
//     const [rows] = await connection.execute(`
//       SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       ORDER BY invoices.date DESC
//       LIMIT 5`);

//     const data = rows as LatestInvoiceRaw[];
//     const latestInvoices = data.map((invoice) => ({
//       ...invoice,
//       amount: formatCurrency(invoice.amount),
//     }));
//     return latestInvoices;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch the latest invoices.");
//   } finally {
//     if (connection) await connection.end();
//   }
// }

// export async function fetchCardData() {
//   let connection;
//   try {
//     // You can probably combine these into a single SQL query
//     // However, we are intentionally splitting them to demonstrate
//     // how to initialize multiple queries in parallel with JS.
//     connection = await getConnection();

//     const [invoiceCountResult] = await connection.execute(
//       "SELECT COUNT(*) as count FROM invoices"
//     );
//     const [customerCountResult] = await connection.execute(
//       "SELECT COUNT(*) as count FROM customers"
//     );
//     const [invoiceStatusResult] = await connection.execute(`SELECT
//          SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
//          SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
//          FROM invoices`);

//     const numberOfInvoices = Number(
//       (invoiceCountResult as { count: number }[])[0].count ?? "0"
//     );
//     const numberOfCustomers = Number(
//       (customerCountResult as { count: number }[])[0].count ?? "0"
//     );
//     const totalPaidInvoices = formatCurrency(
//       (invoiceStatusResult as { paid: number; pending: number }[])[0].paid ??
//         "0"
//     );
//     const totalPendingInvoices = formatCurrency(
//       (invoiceStatusResult as { paid: number; pending: number }[])[0].pending ??
//         "0"
//     );

//     return {
//       numberOfCustomers,
//       numberOfInvoices,
//       totalPaidInvoices,
//       totalPendingInvoices,
//     };
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch card data.");
//   } finally {
//     if (connection) await connection.end();
//   }
// }

// const ITEMS_PER_PAGE = 6;
// export async function fetchFilteredInvoices(
//   query: string,
//   currentPage: number
// ) {
//   const offset = (currentPage - 1) * ITEMS_PER_PAGE;
//   let connection;

//   try {
//     connection = await getConnection();
//     const [rows] = await connection.execute(
//       `
//       SELECT
//         invoices.id,
//         invoices.amount,
//         invoices.date,
//         invoices.status,
//         customers.name,
//         customers.email,
//         customers.image_url
//       FROM invoices
//       JOIN customers ON invoices.customer_id = customers.id
//       WHERE
//         customers.name LIKE ? OR
//         customers.email LIKE ? OR
//         CAST(invoices.amount AS CHAR) LIKE ? OR
//         CAST(invoices.date AS CHAR) LIKE ? OR
//         invoices.status LIKE ?
//       ORDER BY invoices.date DESC
//       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
//       `,
//       [
//         `%${query}%`,
//         `%${query}%`,
//         `%${query}%`,
//         `%${query}%`,
//         `%${query}%`,
//         // offset,
//         // ITEMS_PER_PAGE,
//       ]
//     );

//     return rows as InvoicesTable[];
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch invoices.");
//   } finally {
//     if (connection) await connection.end();
//   }
// }

// export async function fetchInvoicesPages(query: string) {
//   let connection;
//   try {
//     connection = await getConnection();
//     const [rows] = await connection.execute(
//       `SELECT COUNT(*) as count
//     FROM invoices
//     JOIN customers ON invoices.customer_id = customers.id
//     WHERE
//       customers.name LIKE ? OR
//       customers.email LIKE ? OR
//       CAST(invoices.amount AS CHAR) LIKE ? OR
//       CAST(invoices.date AS CHAR) LIKE ? OR
//       invoices.status LIKE ?
//   `,
//       [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
//     );

//     const totalPages = Math.ceil(
//       Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
//     );
//     return totalPages;
//   } catch (error) {
//     console.error("Database Error:", error);
//     throw new Error("Failed to fetch total number of invoices.");
//   } finally {
//     if (connection) await connection.end();
//   }
// }

export async function fetchInvoiceById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ?
    `,
      [id]
    );

    const data = rows as InvoiceForm[];
    const invoice = data.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchCustomers() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT
        id,
        name_ku,
        name_ar,
        name_en,
        position_ku,
        position_ar,
        position_en,
        image_url
      FROM teams
    `);
    return rows as TeamField[];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  } finally {
    if (connection) await connection.end();
  }
}

// Fetch all team members for about page
export async function fetchTeams() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT
        id,
        name_ku,
        name_ar,
        name_en,
        position_ku,
        position_ar,
        position_en,
        image_url
      FROM teams
      ORDER BY id ASC
    `);
    return rows as TeamField[];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch teams.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredTeams(query: string, currentPage: number) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT * FROM teams
      WHERE name_ku LIKE ? OR name_ar LIKE ? OR name_en LIKE ?
      LIMIT 10 OFFSET ${ITEMS_PER_PAGE}
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows as TeamField[];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  } finally {
    if (connection) await connection.end();
  }
}

const ITEMS_PER_PAGE = 10;
export async function fetchTotalTeamsPages(query: string) {
  const connection = await getConnection();
  const [rows] = await connection.execute(
    `
      SELECT COUNT(*) as count FROM teams
      WHERE name_ku LIKE ? OR name_ar LIKE ? OR name_en LIKE ?
    `,
    [`%${query}%`, `%${query}%`, `%${query}%`]
  );

  const totalPages = Math.ceil(
    Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
  );
  return totalPages;
}

export async function fetchProjects() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT 
        p.*,
        (SELECT image_url FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM projects p
      ORDER BY p.date DESC
    `);
    return rows as Project[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch projects.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredProjects(
  query: string,
  currentPage: number
) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT 
        p.*,
        pc.title_en as category_name,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        l.city_en as location_en,
        l.city_ku as location_ku,
        l.city_ar as location_ar,
        (SELECT image_url FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM projects p
      LEFT JOIN project_categories pc ON p.project_category = pc.id
      LEFT JOIN locations l ON p.location_id = l.id
      WHERE p.title_ku LIKE ? OR p.title_ar LIKE ? OR p.title_en LIKE ?
      ORDER BY p.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows as Project[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch projects.");
  } finally {
    if (connection) await connection.end();
  }
}

// Public projects showcase with advanced filters
export async function fetchPublicProjects(filters?: {
  search?: string;
  location?: string;
  category?: string;
  status?: string;
}) {
  let connection;
  try {
    connection = await getConnection();

    // Build WHERE clause based on filters
    const conditions: string[] = [];
    const params: string[] = [];

    if (filters?.search) {
      conditions.push(
        "(p.title_ku LIKE ? OR p.title_ar LIKE ? OR p.title_en LIKE ? OR p.description_ku LIKE ? OR p.description_ar LIKE ? OR p.description_en LIKE ?)"
      );
      params.push(
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`,
        `%${filters.search}%`
      );
    }

    if (filters?.location) {
      conditions.push(
        "(l.city_ku LIKE ? OR l.city_ar LIKE ? OR l.city_en LIKE ?)"
      );
      params.push(
        `%${filters.location}%`,
        `%${filters.location}%`,
        `%${filters.location}%`
      );
    }

    if (filters?.category) {
      conditions.push("p.project_category = ?");
      params.push(filters.category);
    }

    if (filters?.status !== undefined && filters?.status !== "") {
      conditions.push("p.project_status = ?");
      params.push(filters.status);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await connection.execute(
      `
      SELECT 
        p.*,
        pc.title_en as category_name_en,
        pc.title_ku as category_name_ku,
        pc.title_ar as category_name_ar,
        l.city_en as location_en,
        l.city_ku as location_ku,
        l.city_ar as location_ar,
        (SELECT image_url FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = p.id AND parent_type = '${ParentType.Project}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM projects p
      LEFT JOIN project_categories pc ON p.project_category = pc.id
      LEFT JOIN locations l ON p.location_id = l.id
      ${whereClause}
      ORDER BY p.date DESC
    `,
      params
    );
    return rows as Project[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch public projects.");
  } finally {
    if (connection) await connection.end();
  }
}

// Get unique locations from projects
export async function fetchProjectLocations() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT DISTINCT 
        l.city_en as location_en, 
        l.city_ku as location_ku, 
        l.city_ar as location_ar 
      FROM projects p
      LEFT JOIN locations l ON p.location_id = l.id
      WHERE l.city_en IS NOT NULL AND l.city_en != ''
      ORDER BY l.city_en ASC
    `);
    return rows as Array<{
      location_en: string;
      location_ku: string;
      location_ar: string;
    }>;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project locations.");
  } finally {
    if (connection) await connection.end();
  }
}

// event data functions
export async function fetchBlogs() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT 
        b.*,
        (SELECT image_url FROM galleries WHERE parent_id = b.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = b.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = b.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM event b
      ORDER BY b.id DESC
    `);
    return rows as Blog[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch event.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchBlogById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT event.*, 
        (SELECT image_url FROM galleries WHERE parent_id = event.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = event.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = event.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM event 
      WHERE event.id = ?`,
      [id]
    );
    return rows as Blog[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch event.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredBlogs(query: string, currentPage: number) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT 
        b.*,
        (SELECT image_url FROM galleries WHERE parent_id = b.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = b.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = b.id AND parent_type = '${ParentType.Blog}' ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM event b
      WHERE b.title_ku LIKE ? OR b.title_ar LIKE ? OR b.title_en LIKE ?
      ORDER BY b.id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows as Blog[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch event.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalBlogsPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count
    FROM event
    WHERE
      title_ku LIKE ? OR
      title_ar LIKE ? OR
      title_en LIKE ?
  `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    const totalPages = Math.ceil(
      Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
    );
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of event.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchBlogGalleries(blogId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM galleries WHERE parent_id = ? AND parent_type = ? ORDER BY CAST(order_index AS UNSIGNED) ASC",
      [blogId, ParentType.Blog.toString()]
    );
    return rows as Gallery[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch event galleries.");
  } finally {
    if (connection) await connection.end();
  }
}

// Machine data functions
export async function fetchProducts() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT 
        p.*,
        (SELECT image_url FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM products p
      ORDER BY p.title_en
    `);
    return rows as Product[];
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
    const [rows] = await connection.execute(
      `SELECT 
        p.*,
        (SELECT image_url FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_order_index
       FROM products p 
       WHERE p.id = ?`,
      [id]
    );
    return rows as Product[];
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
  let connection;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT 
        p.*,
        (SELECT image_url FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_order_index
       FROM products p
       WHERE 
         p.title_ku LIKE ? OR
         p.title_ar LIKE ? OR
         p.title_en LIKE ? OR
         p.description_ku LIKE ? OR
         p.description_ar LIKE ? OR
         p.description_en LIKE ?
       ORDER BY p.title_en
       LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`,
      [
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
      ]
    );
    return rows as Product[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered products.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalProductsPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count
       FROM products p
       WHERE 
         p.title_ku LIKE ? OR
         p.title_ar LIKE ? OR
         p.title_en LIKE ? OR
         p.description_ku LIKE ? OR
         p.description_ar LIKE ? OR
         p.description_en LIKE ?`,
      [
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
      ]
    );
    const totalPages = Math.ceil((rows as any)[0].count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of products.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchProductGalleries(productId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM galleries 
       WHERE parent_id = ? AND parent_type = ? 
       ORDER BY order_index ASC`,
      [productId, ParentType.Product]
    );
    return rows as Gallery[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product galleries.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchProductsByGroup(groupId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT 
        p.*,
        (SELECT image_url FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_image_url,
        (SELECT alt_text FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_alt_text,
        (SELECT order_index FROM galleries WHERE parent_id = p.id AND parent_type = ${ParentType.Product} ORDER BY order_index ASC LIMIT 1) as gallery_order_index
      FROM products p
      WHERE p.product_group_id = ?
      ORDER BY p.title_en
    `,
      [groupId]
    );
    return rows as Product[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch products by group.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalProjectsPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT COUNT(*) as count FROM projects
      WHERE title_ku LIKE ? OR title_ar LIKE ? OR title_en LIKE ?
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    const totalPages = Math.ceil(
      Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
    );
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of projects.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchProjectGalleries(projectId: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT * FROM galleries 
       WHERE parent_id = ? AND parent_type = '${ParentType.Project}'
       ORDER BY order_index ASC`,
      [projectId]
    );
    return rows as Gallery[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch project galleries.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchQuotes() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT * FROM quotes
    `);
    return rows as Quote[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quotes.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchQuoteById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT id, title_ku, title_en, title_ar, image_url FROM quotes
      WHERE id = ?
    `,
      [id]
    );
    return rows as Quote[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quote.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredQuotes(query: string, currentPage: number) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT id, title_ku, title_en, title_ar, image_url FROM quotes
      WHERE title_ku LIKE ? OR title_ar LIKE ? OR title_en LIKE ?
      ORDER BY id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows as Quote[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch quotes.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalQuotesPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count
    FROM quotes
    WHERE
      title_ku LIKE ? OR
      title_en LIKE ? OR
      title_ar LIKE ?
  `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    const totalPages = Math.ceil(
      Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
    );
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of quotes.");
  } finally {
    if (connection) await connection.end();
  }
}

// Social Media data functions
export async function fetchSocialMedia() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT * FROM social_media
      ORDER BY type ASC
    `);
    return rows as SocialMedia[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch social media.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchSocialMediaById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT * FROM social_media
      WHERE id = ?
    `,
      [id]
    );
    return rows as SocialMedia[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch social media.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredSocialMedia(
  query: string,
  currentPage: number
) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT * FROM social_media
      WHERE url LIKE ?
      ORDER BY type ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `,
      [`%${query}%`]
    );
    return rows as SocialMedia[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch social media.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalSocialMediaPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count
    FROM social_media
    WHERE url LIKE ?
  `,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(
      Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
    );
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of social media.");
  } finally {
    if (connection) await connection.end();
  }
}

// Properties data functions
export async function fetchProperties() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT * FROM properties
    `);
    return rows as Property[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch properties.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchPropertyById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT * FROM properties
      WHERE id = ?
    `,
      [id]
    );
    return rows as Property[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch property.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredProperties(
  query: string,
  currentPage: number
) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT * FROM properties
      WHERE \`key\` LIKE ? OR value_en LIKE ? OR value_ku LIKE ? OR value_ar LIKE ?
      ORDER BY \`key\` ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows as Property[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch properties.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalPropertiesPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count
    FROM properties
    WHERE \`key\` LIKE ? OR value_en LIKE ? OR value_ku LIKE ? OR value_ar LIKE ?
  `,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );

    const totalPages = Math.ceil(
      Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
    );
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of properties.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchSpecialProjectsById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT * FROM special_projects
      WHERE id = ?
    `,
      [id]
    );
    return rows as SpecialProjects[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch special projects.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredSpecialProjects(
  query: string,
  currentPage: number
) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT * FROM special_projects
      ORDER BY sort_order ASC, id ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `
    );
    return rows as SpecialProjects[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch special projects.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalSpecialProjectsPages() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count FROM special_projects`
    );

    const totalPages = Math.ceil(
      Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
    );
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of special projects.");
  } finally {
    if (connection) await connection.end();
  }
}

// Banner Data Fetching
export async function fetchFilteredBanners(query: string, currentPage: number) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT id, title_ku, title_en, title_ar, image_url, video_url, type, is_active, sort_order FROM banners
      WHERE title_ku LIKE ? OR title_ar LIKE ? OR title_en LIKE ?
      ORDER BY sort_order ASC, id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows as Banner[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch banners.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchBannerById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT id, title_ku, title_en, title_ar, image_url, video_url, type, is_active, sort_order FROM banners
      WHERE id = ?
    `,
      [id]
    );
    return rows as Banner[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch banner.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalBannersPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT COUNT(*) as count FROM banners
      WHERE title_ku LIKE ? OR title_ar LIKE ? OR title_en LIKE ?
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    const totalPages = Math.ceil((rows as any[])[0].count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total banner pages.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchActiveBanners() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT id, title_ku, title_en, title_ar, image_url, video_url, type, is_active, sort_order FROM banners
      WHERE is_active = true
      ORDER BY sort_order ASC, id DESC
    `
    );
    return rows as Banner[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch active banners.");
  } finally {
    if (connection) await connection.end();
  }
}

// Audio Data Fetching
export async function fetchFilteredAudios(query: string, currentPage: number) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT id, title_ku, title_en, title_ar, audio_url, is_active, use_for FROM audios
      WHERE title_ku LIKE ? OR title_ar LIKE ? OR title_en LIKE ?
      ORDER BY id DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows as Audio[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch audios.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchAudioById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT id, title_ku, title_en, title_ar, audio_url, is_active, use_for FROM audios
      WHERE id = ?
    `,
      [id]
    );
    return rows as Audio[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch audio.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalAudiosPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT COUNT(*) as count FROM audios
      WHERE title_ku LIKE ? OR title_ar LIKE ? OR title_en LIKE ?
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    const totalPages = Math.ceil((rows as any[])[0].count / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total audio pages.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchActiveAudios(useFor?: "landing" | "intro" | "both") {
  let connection;
  try {
    connection = await getConnection();
    let query = `
      SELECT id, title_ku, title_en, title_ar, audio_url, is_active, use_for FROM audios
      WHERE is_active = true
    `;

    if (useFor) {
      query += ` AND (use_for = ? OR use_for = 'both')`;
    }

    query += ` ORDER BY id DESC LIMIT 1`;

    const [rows] = useFor
      ? await connection.execute(query, [useFor])
      : await connection.execute(query);

    return rows as Audio[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch active audios.");
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

export async function fetchGraphicById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT id, image_url, created_at FROM graphics WHERE id = ?",
      [id]
    );
    return rows as Graphic[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch graphic.");
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

// FOOTER PROPERTIES DATA FETCHING
export async function fetchFooterProperties() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM footer_properties WHERE is_active = TRUE ORDER BY property_type, display_order ASC"
    );
    return rows as FooterProperty[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch footer properties.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFooterPropertiesByType(type: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM footer_properties WHERE property_type = ? AND is_active = TRUE ORDER BY display_order ASC",
      [type]
    );
    return rows as FooterProperty[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch footer properties by type.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFooterPropertyById(id: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM footer_properties WHERE id = ?",
      [id]
    );
    return rows as FooterProperty[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch footer property.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredFooterProperties(
  query: string,
  currentPage: number
) {
  let connection;
  try {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT * FROM footer_properties
      WHERE title_en LIKE ? OR title_ar LIKE ? OR title_ku LIKE ? OR content_en LIKE ?
      ORDER BY property_type, display_order ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );
    return rows as FooterProperty[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch footer properties.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchTotalFooterPropertiesPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count FROM footer_properties
       WHERE title_en LIKE ? OR title_ar LIKE ? OR title_ku LIKE ? OR content_en LIKE ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );
    const totalPages = Math.ceil(
      Number((rows as any)[0].count) / ITEMS_PER_PAGE
    );
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total footer properties pages.");
  } finally {
    if (connection) await connection.end();
  }
}
