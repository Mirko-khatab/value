# Reusable Dashboard Components Implementation Guide

## Overview

This project now has unified, reusable components for all dashboard sections:

- ✅ **Breadcrumbs**: One component for all navigation breadcrumbs
- ✅ **Table**: One dynamic table component for all entity lists
- ✅ **Form**: One dynamic form component for create/edit pages

## What Has Been Created

### Core Components (in `/app/ui/dashboard/`)

1. **breadcrumbs.tsx** - Unified breadcrumbs component
2. **table.tsx** - Generic table component with column configuration
3. **form.tsx** - Generic form component with field configuration

### Example Implementations

**Table Examples:**

- `properties-table-config.tsx` - Configuration for properties table
- `properties-table.tsx` - Properties table wrapper
- `products-table-config.tsx` - Configuration for products table
- `products-table.tsx` - Products table wrapper
- `projects-table-config.tsx` - Configuration for projects table
- `projects-table.tsx` - Projects table wrapper

**Form Examples:**

- `properties-form-config.tsx` - Configuration for properties form

### Documentation

- `README.md` - Comprehensive usage guide

## Quick Start: Converting Existing Tables

### Step 1: Create Table Configuration

Create a config file: `app/ui/dashboard/[entity]-table-config.tsx`

```tsx
import { YourEntity } from "@/app/lib/definitions";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteYourEntity } from "@/app/lib/actions";
import { Column, ActionButton } from "./table";

// Define columns
export const yourEntityColumns: Column<YourEntity>[] = [
  {
    header: "Name",
    key: "name_en",
  },
  {
    header: "Description",
    key: "description_en",
  },
  {
    header: "Custom",
    key: "some_field",
    render: (item) => item.some_field || "N/A", // Custom rendering
  },
];

// Define actions
export const yourEntityActions = (item: YourEntity): ActionButton[] => [
  {
    label: "Edit",
    href: `/dashboard/your-entity/${item.id}/edit`,
    icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
  },
  {
    label: "Delete",
    form: true,
    onClick: async (id: string) => {
      await deleteYourEntity(id);
    },
    icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
  },
];
```

### Step 2: Create Table Wrapper

Create wrapper: `app/ui/dashboard/[entity]-table.tsx`

```tsx
import { fetchFilteredYourEntity } from "@/app/lib/data";
import DashboardTable from "./table";
import {
  yourEntityColumns,
  yourEntityActions,
} from "./your-entity-table-config";

export default async function YourEntityTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const data = await fetchFilteredYourEntity(query, currentPage);

  return (
    <DashboardTable
      data={data}
      columns={yourEntityColumns}
      actions={yourEntityActions}
      // Optional props for entities with images:
      viewPath="/dashboard/your-entity"
      imageField="gallery_image_url"
      titleField="name_en"
      altTextField="gallery_alt_text"
    />
  );
}
```

### Step 3: Update Page to Use New Table

Update `app/dashboard/your-entity/page.tsx`:

```tsx
// OLD:
import YourEntityTable from "@/app/ui/your-entity/table";

// NEW:
import YourEntityTable from "@/app/ui/dashboard/your-entity-table";

// Usage stays the same:
<YourEntityTable query={query} currentPage={currentPage} />;
```

### Step 4: Delete Old Table File

```bash
rm app/ui/your-entity/table.tsx
```

## Quick Start: Converting Existing Forms

### Step 1: Create Form Configuration

Create config file: `app/ui/dashboard/[entity]-form-config.tsx`

```tsx
import { YourEntity } from "@/app/lib/definitions";
import { createYourEntity, updateYourEntity } from "@/app/lib/actions";
import { FormField } from "./form";

// Define form fields
export const yourEntityFields: FormField[] = [
  {
    name: "name_en",
    label: "Name (English)",
    type: "text",
    required: true,
    placeholder: "Enter name",
    gridCol: "half", // "half" or "full" width
  },
  {
    name: "name_ku",
    label: "Name (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "description_en",
    label: "Description (English)",
    type: "textarea",
    required: true,
    rows: 4,
    gridCol: "full",
  },
  {
    name: "date",
    label: "Date",
    type: "date",
    required: false,
    gridCol: "half",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ],
    gridCol: "half",
  },
  {
    name: "is_featured",
    label: "Featured",
    type: "checkbox",
    gridCol: "full",
  },
];

// Submit handler
export const handleYourEntitySubmit = async (
  mode: "create" | "edit",
  entityId: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && entityId) {
    await updateYourEntity(entityId, formData);
  } else {
    await createYourEntity(formData);
  }
};
```

### Step 2: Update Create Page

Update `app/dashboard/your-entity/create/page.tsx`:

```tsx
import DashboardForm from "@/app/ui/dashboard/form";
import {
  yourEntityFields,
  handleYourEntitySubmit,
} from "@/app/ui/dashboard/your-entity-form-config";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Your Entities", href: "/dashboard/your-entity" },
          {
            label: "Create",
            href: "/dashboard/your-entity/create",
            active: true,
          },
        ]}
      />
      <DashboardForm
        fields={yourEntityFields}
        mode="create"
        onSubmit={(formData, data) =>
          handleYourEntitySubmit("create", undefined, formData)
        }
        cancelPath="/dashboard/your-entity"
        entityName="Your Entity"
      />
    </main>
  );
}
```

### Step 3: Update Edit Page

Update `app/dashboard/your-entity/[id]/edit/page.tsx`:

```tsx
import DashboardForm from "@/app/ui/dashboard/form";
import {
  yourEntityFields,
  handleYourEntitySubmit,
} from "@/app/ui/dashboard/your-entity-form-config";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { fetchYourEntityById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const entity = await fetchYourEntityById(params.id);

  if (!entity) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Your Entities", href: "/dashboard/your-entity" },
          {
            label: "Edit",
            href: `/dashboard/your-entity/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      <DashboardForm
        fields={yourEntityFields}
        mode="edit"
        initialData={entity}
        onSubmit={(formData, data) =>
          handleYourEntitySubmit("edit", params.id, formData)
        }
        cancelPath="/dashboard/your-entity"
        entityName="Your Entity"
      />
    </main>
  );
}
```

### Step 4: Delete Old Form File

```bash
rm app/ui/your-entity/form.tsx
```

## Advanced Features

### Custom Column Rendering

```tsx
{
  header: "Status",
  key: "is_active",
  render: (item) => (
    <span className={item.is_active ? "text-green-500" : "text-red-500"}>
      {item.is_active ? "Active" : "Inactive"}
    </span>
  ),
}
```

### Custom Form Fields

```tsx
{
  name: "custom_field",
  label: "Custom Field",
  type: "custom",
  customRender: (value, onChange, error) => (
    <div>
      <YourCustomComponent value={value} onChange={onChange} />
      {error && <p className="text-red-500">{error}</p>}
    </div>
  ),
}
```

### Form with Gallery Upload

```tsx
<DashboardForm
  fields={yourEntityFields}
  mode="create"
  onSubmit={handleSubmit}
  cancelPath="/dashboard/your-entity"
  entityName="Your Entity"
  customContent={
    <MultipleImageUpload
      onImagesChange={handleImagesChange}
      initialImages={initialImages}
    />
  }
/>
```

### Field Validation

```tsx
{
  name: "email",
  label: "Email",
  type: "text",
  required: true,
  validation: (value) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Invalid email address";
    }
  },
}
```

## Migration Checklist

For each dashboard entity (products, projects, properties, etc.):

### Tables:

- [ ] Create `[entity]-table-config.tsx` in `/app/ui/dashboard/`
- [ ] Define columns array
- [ ] Define actions function
- [ ] Create `[entity]-table.tsx` wrapper
- [ ] Update page to import from `/app/ui/dashboard/`
- [ ] Test functionality
- [ ] Delete old `/app/ui/[entity]/table.tsx`

### Forms:

- [ ] Create `[entity]-form-config.tsx` in `/app/ui/dashboard/`
- [ ] Define fields array
- [ ] Define submit handler
- [ ] Update create page
- [ ] Update edit page
- [ ] Update breadcrumbs imports
- [ ] Test create functionality
- [ ] Test edit functionality
- [ ] Delete old `/app/ui/[entity]/form.tsx`

## Benefits

### Before (per entity):

```
app/ui/products/
  ├── breadcrumbs.tsx       (45 lines)
  ├── table.tsx             (149 lines)
  ├── form.tsx              (285 lines)
  └── buttons.tsx           (45 lines)
Total: ~524 lines × 10 entities = ~5,240 lines
```

### After (per entity):

```
app/ui/dashboard/
  ├── products-table-config.tsx   (35 lines)
  ├── products-table.tsx          (15 lines)
  └── products-form-config.tsx    (50 lines)
Total: ~100 lines × 10 entities = ~1,000 lines
```

**Result: 80% code reduction + shared components!**

## Entities to Migrate

- [ ] Products
- [ ] Projects
- [ ] Properties
- [ ] Teams
- [ ] Quotes
- [ ] Banners
- [ ] Audios
- [ ] event/Blogs
- [ ] Social Media
- [ ] Special Projects

## Support

For questions or issues:

1. Check the `/app/ui/dashboard/README.md`
2. Review example implementations (properties, products, projects)
3. Check the component source code for available props and options

