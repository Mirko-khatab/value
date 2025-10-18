// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Property = {
  id: string;
  key: string;
  value_ku: string;
  value_ar: string;
  value_en: string;
};

export type SpecialProjects = {
  id: string;
  image_url: string;
  sort_order: number;
};

export type Quote = {
  id: string;
  title_ku: string;
  title_en: string;
  title_ar: string;
  image_url: string;
};

export type Banner = {
  id: string;
  title_ku: string;
  title_en: string;
  title_ar: string;
  image_url: string;
  video_url: string;
  type: "image" | "video";
  is_active: boolean;
  sort_order: number;
};

export enum SocialMediaType {
  Instagram = 0,
  Facebook = 1,
  X = 2,
}

export type SocialMedia = {
  id: string;
  type: SocialMediaType;
  url: string;
};

// Legacy type - machine groups have been removed from database
export type MachineGroup = {
  id: string;
  title_ar: string;
  title_en: string;
  title_ku: string;
};

export type Blog = {
  id: string;
  title_ku: string;
  title_ar: string;
  title_en: string;
  description_ku: string;
  description_ar: string;
  description_en: string;
  // Gallery fields (from JOIN queries)
  gallery_image_url?: string;
  gallery_alt_text?: string;
  gallery_order_index?: string;
};

export type Product = {
  id: string;
  title_ar: string;
  title_en: string;
  title_ku: string;
  description_ar: string;
  description_en: string;
  description_ku: string;
  // Gallery fields (from JOIN queries)
  gallery_image_url?: string;
  gallery_alt_text?: string;
  gallery_order_index?: string;
};

// Legacy alias for backward compatibility - keeping for existing code
export type Machine = Product;

export type Project = {
  id: string;
  title_ku: string;
  title_ar: string;
  title_en: string;
  description_ku: string;
  description_ar: string;
  description_en: string;
  date: string | Date;
  // Gallery fields (from JOIN queries)
  gallery_image_url?: string;
  gallery_alt_text?: string;
  gallery_order_index?: string;
};

//0=project 1=blog 2=product	 parent_type
export enum ParentType {
  Project = 0,
  Blog = 1,
  Product = 2,
}

export type Gallery = {
  id: string;
  parent_id: string;
  parent_type: ParentType;
  image_url: string;
  alt_text: string;
  order_index: string;
  created_at: string;
};

export type Invoice = {
  id: string;
  customer_id: string;
  amount: number;
  date: string;
  // In TypeScript, this is called a string union type.
  // It means that the "status" property can only be one of the two strings: 'pending' or 'paid'.
  status: "pending" | "paid";
};

export type Revenue = {
  month: string;
  revenue: number;
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, "amount"> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: "pending" | "paid";
};

export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type TeamField = {
  id: string;
  name_ku: string;
  name_ar: string;
  name_en: string;
  position_ku: string;
  position_ar: string;
  position_en: string;
  image_url: string;
  special: string;
};

export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: "pending" | "paid";
};
