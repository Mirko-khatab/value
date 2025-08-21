import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
} from "./definitions";
import { formatCurrency } from "./utils";
import { getConnection } from "./serverutils";

export async function fetchRevenue() {
  let connection;
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    // console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 1000));

    connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM revenue");

    // console.log("Data fetch completed after 3 seconds.");

    return rows as Revenue[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchLatestInvoices() {
  let connection;
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    connection = await getConnection();
    const [rows] = await connection.execute(`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`);

    const data = rows as LatestInvoiceRaw[];
    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchCardData() {
  let connection;
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    connection = await getConnection();

    const [invoiceCountResult] = await connection.execute(
      "SELECT COUNT(*) as count FROM invoices"
    );
    const [customerCountResult] = await connection.execute(
      "SELECT COUNT(*) as count FROM customers"
    );
    const [invoiceStatusResult] = await connection.execute(`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS paid,
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS pending
         FROM invoices`);

    const numberOfInvoices = Number(
      (invoiceCountResult as { count: number }[])[0].count ?? "0"
    );
    const numberOfCustomers = Number(
      (customerCountResult as { count: number }[])[0].count ?? "0"
    );
    const totalPaidInvoices = formatCurrency(
      (invoiceStatusResult as { paid: number; pending: number }[])[0].paid ??
        "0"
    );
    const totalPendingInvoices = formatCurrency(
      (invoiceStatusResult as { paid: number; pending: number }[])[0].pending ??
        "0"
    );

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  } finally {
    if (connection) await connection.end();
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name LIKE ? OR
        customers.email LIKE ? OR
        CAST(invoices.amount AS CHAR) LIKE ? OR
        CAST(invoices.date AS CHAR) LIKE ? OR
        invoices.status LIKE ?
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `,
      [
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        `%${query}%`,
        // offset,
        // ITEMS_PER_PAGE,
      ]
    );

    return rows as InvoicesTable[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchInvoicesPages(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT COUNT(*) as count
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name LIKE ? OR
      customers.email LIKE ? OR
      CAST(invoices.amount AS CHAR) LIKE ? OR
      CAST(invoices.date AS CHAR) LIKE ? OR
      invoices.status LIKE ?
  `,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]
    );

    const totalPages = Math.ceil(
      Number((rows as { count: number }[])[0].count) / ITEMS_PER_PAGE
    );
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  } finally {
    if (connection) await connection.end();
  }
}

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
        name
      FROM customers
      ORDER BY name ASC
    `);

    return rows as CustomerField[];
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  } finally {
    if (connection) await connection.end();
  }
}

export async function fetchFilteredCustomers(query: string) {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name LIKE ? OR
        customers.email LIKE ?
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `,
      [`%${query}%`, `%${query}%`]
    );

    const data = rows as CustomersTableType[];
    const customers = data.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  } finally {
    if (connection) await connection.end();
  }
}
