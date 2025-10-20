# Dashboard Reusable Components

This directory contains unified, reusable components for all dashboard sections.

## Components

### 1. Breadcrumbs (`breadcrumbs.tsx`)

A unified breadcrumbs component used across all dashboard pages.

**Usage:**
```tsx
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";

<Breadcrumbs
  breadcrumbs={[
    { label: "Products", href: "/dashboard/products" },
    { label: "Create Product", href: "/dashboard/products/create", active: true },
  ]}
/>
```

### 2. Table (`table.tsx`)

A generic, reusable table component with:
- Responsive design (mobile cards + desktop table)
- Dark mode support
- Customizable columns
- Action buttons (edit, delete, etc.)
- Image support with fallbacks
- Clickable rows/titles

**Usage:**

1. **Create a configuration file** (e.g., `products-table-config.tsx`):

```tsx
import { Product } from "@/app/lib/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteProduct } from "@/app/lib/actions";
import { Column, ActionButton } from "./table";

export const productsColumns: Column<Product>[] = [
  {
    header: "Product",
    key: "title_en",
  },
  {
    header: "Description",
    key: "description_en",
  },
  {
    header: "Order",
    key: "gallery_order_index",
    render: (product) => product.gallery_order_index || "N/A",
  },
];

export const productsActions = (product: Product): ActionButton[] => [
  {
    label: "Edit",
    href: `/dashboard/products/${product.id}/edit`,
    icon: <PencilIcon className="w-5 text-blue-500" />,
  },
  {
    label: "Delete",
    form: true,
    onClick: async (id: string) => {
      await deleteProduct(id);
    },
    icon: <TrashIcon className="w-5 text-red-500" />,
  },
];
```

2. **Create a wrapper component** (e.g., `products-table.tsx`):

```tsx
import { fetchFilteredProducts } from "@/app/lib/data";
import DashboardTable from "./table";
import { productsColumns, productsActions } from "./products-table-config";

export default async function ProductsTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const products = await fetchFilteredProducts(query, currentPage);

  return (
    <DashboardTable
      data={products}
      columns={productsColumns}
      actions={productsActions}
      viewPath="/dashboard/products"
      imageField="gallery_image_url"
      titleField="title_en"
      altTextField="gallery_alt_text"
    />
  );
}
```

3. **Use in your page:**

```tsx
import ProductsTable from "@/app/ui/dashboard/products-table";

<ProductsTable query={query} currentPage={currentPage} />
```

**Props:**
- `data`: Array of items to display
- `columns`: Array of column configurations
- `actions`: Function that returns action buttons for each item
- `viewPath`: Optional base path for view links (e.g., "/dashboard/products")
- `imageField`: Optional field name for image URL
- `titleField`: Optional field name for the title (used in first column)
- `altTextField`: Optional field name for image alt text
- `mobileView`: Optional custom render function for mobile cards

### 3. Form (`form.tsx`)

A generic, reusable form component with:
- Create/Edit modes
- Multi-language support
- Various field types (text, textarea, date, select, checkbox, custom)
- Validation
- Success/Error messaging
- Dark mode support

**Usage:**

1. **Create a configuration file** (e.g., `properties-form-config.tsx`):

```tsx
import { FormField } from "./form";
import { createProperty, updateProperty } from "@/app/lib/actions";

export const propertiesFields: FormField[] = [
  {
    name: "key",
    label: "Property Key",
    type: "text",
    required: true,
    placeholder: "Enter property key",
    helpText: "Unique identifier for this property",
    gridCol: "half",
  },
  {
    name: "value_en",
    label: "Value (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  // ... more fields
];

export const handlePropertySubmit = async (
  mode: "create" | "edit",
  propertyId: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && propertyId) {
    await updateProperty(propertyId, formData);
  } else {
    await createProperty(formData);
  }
};
```

2. **Use in your page:**

```tsx
import DashboardForm from "@/app/ui/dashboard/form";
import { propertiesFields, handlePropertySubmit } from "@/app/ui/dashboard/properties-form-config";

export default function Page({ property, mode }: { property?: Property; mode: "create" | "edit" }) {
  return (
    <DashboardForm
      fields={propertiesFields}
      mode={mode}
      initialData={property}
      onSubmit={(formData, data) => handlePropertySubmit(mode, property?.id, formData)}
      cancelPath="/dashboard/properties"
      entityName="Property"
    />
  );
}
```

**Field Types:**
- `text`: Single-line text input
- `textarea`: Multi-line text input
- `date`: Date picker
- `number`: Number input
- `select`: Dropdown (requires `options` prop)
- `checkbox`: Boolean checkbox
- `custom`: Custom render function (use `customRender` prop)

**Props:**
- `fields`: Array of field configurations
- `mode`: "create" or "edit"
- `initialData`: Initial values for edit mode
- `onSubmit`: Submit handler function
- `cancelPath`: Path to redirect on cancel
- `entityName`: Name of the entity (e.g., "Product", "Property")
- `customContent`: Optional custom content (e.g., image upload component)
- `beforeSubmit`: Optional data transformation before submit

## Migration Guide

### Converting Old Tables

**Before:**
```tsx
// app/ui/products/table.tsx
export default async function ProductsTable({ query, currentPage }) {
  const products = await fetchFilteredProducts(query, currentPage);
  // 150 lines of table JSX...
}
```

**After:**
```tsx
// app/ui/dashboard/products-table-config.tsx
export const productsColumns = [...];
export const productsActions = (...) => [...];

// app/ui/dashboard/products-table.tsx
export default async function ProductsTable({ query, currentPage }) {
  const products = await fetchFilteredProducts(query, currentPage);
  return <DashboardTable data={products} columns={productsColumns} actions={productsActions} />;
}

// app/dashboard/products/page.tsx
import ProductsTable from "@/app/ui/dashboard/products-table";
```

### Converting Old Forms

**Before:**
```tsx
// app/ui/properties/form.tsx
export default function Form({ property, mode }) {
  // 200+ lines of form logic and JSX...
}
```

**After:**
```tsx
// app/ui/dashboard/properties-form-config.tsx
export const propertiesFields = [...];
export const handlePropertySubmit = async (...) => {...};

// app/dashboard/properties/create/page.tsx
import DashboardForm from "@/app/ui/dashboard/form";
import { propertiesFields, handlePropertySubmit } from "@/app/ui/dashboard/properties-form-config";

export default function Page() {
  return (
    <DashboardForm
      fields={propertiesFields}
      mode="create"
      onSubmit={(fd, d) => handlePropertySubmit("create", undefined, fd)}
      cancelPath="/dashboard/properties"
      entityName="Property"
    />
  );
}
```

## Benefits

1. **Code Reusability**: One component for all tables/forms
2. **Consistency**: Same UX across all dashboard sections
3. **Maintainability**: Fix bugs once, apply everywhere
4. **Dark Mode**: Built-in support
5. **Responsive**: Mobile-first design
6. **Type Safety**: Full TypeScript support
7. **Flexibility**: Highly configurable for different use cases
8. **Less Code**: Reduce 150+ line components to 10-20 lines


