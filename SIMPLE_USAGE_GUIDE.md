# Simple Usage Guide: One Table & One Form for Everything

## The Truly Reusable Approach

Instead of creating separate table and form files for each entity, we use **ONE table component** and **ONE form component** directly in pages with configurations.

## Files You Need

1. **`/app/ui/dashboard/table.tsx`** - The reusable table component (already created)
2. **`/app/ui/dashboard/form.tsx`** - The reusable form component (already created)
3. **`/app/ui/dashboard/config.tsx`** - All configurations in one place (already created)

That's it! No need for separate files per entity.

---

## Using the Table Component

### Example: Products List Page

**File:** `app/dashboard/products/page.tsx`

```tsx
import { fetchFilteredProducts } from "@/app/lib/data";
import DashboardTable from "@/app/ui/dashboard/table";
import { productsTableConfig } from "@/app/ui/dashboard/config";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const products = await fetchFilteredProducts(query, currentPage);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Products", href: "/dashboard/products", active: true },
        ]}
      />

      <DashboardTable
        data={products}
        columns={productsTableConfig.columns}
        actions={productsTableConfig.actions}
        viewPath={productsTableConfig.viewPath}
        imageField={productsTableConfig.imageField}
        titleField={productsTableConfig.titleField}
        altTextField={productsTableConfig.altTextField}
      />
    </main>
  );
}
```

### Example: Properties List Page (Simple Entity, No Images)

**File:** `app/dashboard/properties/page.tsx`

```tsx
import { fetchFilteredProperties } from "@/app/lib/data";
import DashboardTable from "@/app/ui/dashboard/table";
import { propertiesTableConfig } from "@/app/ui/dashboard/config";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const currentPage = Number(params?.page) || 1;

  const properties = await fetchFilteredProperties(query, currentPage);

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Properties", href: "/dashboard/properties", active: true },
        ]}
      />

      <DashboardTable
        data={properties}
        columns={propertiesTableConfig.columns}
        actions={propertiesTableConfig.actions}
      />
    </main>
  );
}
```

---

## Using the Form Component

### Example: Create Page

**File:** `app/dashboard/properties/create/page.tsx`

```tsx
import DashboardForm from "@/app/ui/dashboard/form";
import {
  propertiesFormFields,
  propertiesFormHandler,
} from "@/app/ui/dashboard/config";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";

export default function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Properties", href: "/dashboard/properties" },
          {
            label: "Create",
            href: "/dashboard/properties/create",
            active: true,
          },
        ]}
      />

      <DashboardForm
        fields={propertiesFormFields}
        mode="create"
        onSubmit={(formData, data) =>
          propertiesFormHandler("create", undefined, formData)
        }
        cancelPath="/dashboard/properties"
        entityName="Property"
      />
    </main>
  );
}
```

### Example: Edit Page

**File:** `app/dashboard/properties/[id]/edit/page.tsx`

```tsx
import DashboardForm from "@/app/ui/dashboard/form";
import {
  propertiesFormFields,
  propertiesFormHandler,
} from "@/app/ui/dashboard/config";
import Breadcrumbs from "@/app/ui/dashboard/breadcrumbs";
import { fetchPropertyById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const property = await fetchPropertyById(params.id);

  if (!property) {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Properties", href: "/dashboard/properties" },
          {
            label: "Edit",
            href: `/dashboard/properties/${params.id}/edit`,
            active: true,
          },
        ]}
      />

      <DashboardForm
        fields={propertiesFormFields}
        mode="edit"
        initialData={property}
        onSubmit={(formData, data) =>
          propertiesFormHandler("edit", params.id, formData)
        }
        cancelPath="/dashboard/properties"
        entityName="Property"
      />
    </main>
  );
}
```

---

## All Configurations in One Place

Edit `/app/ui/dashboard/config.tsx` to add/modify configurations for any entity:

```tsx
// Add a new entity configuration:
export const quotesTableConfig = {
  columns: [
    { header: "Title", key: "title_en" },
    // ... more columns
  ],
  actions: (quote) => [
    {
      label: "Edit",
      href: `/dashboard/quotes/${quote.id}/edit`,
      icon: <PencilIcon />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id) => {
        await deleteQuote(id);
      },
      icon: <TrashIcon />,
    },
  ],
};

export const quotesFormFields: FormField[] = [
  { name: "title_en", label: "Title (English)", type: "text", required: true },
  // ... more fields
];

export const quotesFormHandler = async (mode, id, formData) => {
  if (mode === "edit" && id) {
    await updateQuote(id, formData);
  } else {
    await createQuote(formData);
  }
};
```

---

## Pattern for ANY Entity

### 1. Add Configuration (in `/app/ui/dashboard/config.tsx`)

```tsx
// Table config
export const [entity]TableConfig = {
  columns: [...],
  actions: (item) => [...],
  viewPath: "/dashboard/[entity]",  // optional
  imageField: "image_url",           // optional
  titleField: "title_en",            // optional
};

// Form config
export const [entity]FormFields: FormField[] = [...];

export const [entity]FormHandler = async (mode, id, formData) => {
  if (mode === "edit" && id) {
    await update[Entity](id, formData);
  } else {
    await create[Entity](formData);
  }
};
```

### 2. Use in List Page

```tsx
import DashboardTable from "@/app/ui/dashboard/table";
import { [entity]TableConfig } from "@/app/ui/dashboard/config";

const data = await fetchFiltered[Entity](query, currentPage);

<DashboardTable
  data={data}
  {...[entity]TableConfig}
/>
```

### 3. Use in Create Page

```tsx
import DashboardForm from "@/app/ui/dashboard/form";
import { [entity]FormFields, [entity]FormHandler } from "@/app/ui/dashboard/config";

<DashboardForm
  fields={[entity]FormFields}
  mode="create"
  onSubmit={(fd, d) => [entity]FormHandler("create", undefined, fd)}
  cancelPath="/dashboard/[entity]"
  entityName="[Entity]"
/>
```

### 4. Use in Edit Page

```tsx
import DashboardForm from "@/app/ui/dashboard/form";
import { [entity]FormFields, [entity]FormHandler } from "@/app/ui/dashboard/config";

const entity = await fetch[Entity]ById(id);

<DashboardForm
  fields={[entity]FormFields}
  mode="edit"
  initialData={entity}
  onSubmit={(fd, d) => [entity]FormHandler("edit", id, fd)}
  cancelPath="/dashboard/[entity]"
  entityName="[Entity]"
/>
```

---

## Benefits

### ✅ No Separate Files Per Entity

- No `products-table.tsx`
- No `projects-table.tsx`
- No `properties-form.tsx`
- Just configuration in ONE file

### ✅ Super Simple Pattern

```tsx
// List page:
<DashboardTable data={data} {...configFromOneFile} />

// Create page:
<DashboardForm fields={fields} mode="create" onSubmit={handler} />

// Edit page:
<DashboardForm fields={fields} mode="edit" initialData={data} onSubmit={handler} />
```

### ✅ Easy to Maintain

- All table configs in one place
- All form configs in one place
- Change styling? Edit base component once
- Add feature? Update base component once

---

## File Structure

```
app/
├── ui/
│   └── dashboard/
│       ├── table.tsx          ← ONE table component
│       ├── form.tsx           ← ONE form component
│       ├── breadcrumbs.tsx    ← ONE breadcrumbs component
│       └── config.tsx         ← ALL configurations
│
└── dashboard/
    ├── products/
    │   ├── page.tsx           ← Uses table directly
    │   ├── create/
    │   │   └── page.tsx       ← Uses form directly
    │   └── [id]/
    │       └── edit/
    │           └── page.tsx   ← Uses form directly
    │
    ├── projects/
    │   ├── page.tsx           ← Uses table directly
    │   ├── create/
    │   │   └── page.tsx       ← Uses form directly
    │   └── [id]/
    │       └── edit/
    │           └── page.tsx   ← Uses form directly
    │
    └── properties/
        ├── page.tsx           ← Uses table directly
        ├── create/
        │   └── page.tsx       ← Uses form directly
        └── [id]/
            └── edit/
                └── page.tsx   ← Uses form directly
```

**Result:** 3 base components + 1 config file = works for ALL entities!

---

## Migration Steps

For each entity (products, projects, teams, etc.):

1. **Add config** to `/app/ui/dashboard/config.tsx`:

   - Table columns
   - Table actions
   - Form fields
   - Form handler

2. **Update list page**:

   ```tsx
   import DashboardTable from "@/app/ui/dashboard/table";
   import { [entity]TableConfig } from "@/app/ui/dashboard/config";

   <DashboardTable data={data} {...[entity]TableConfig} />
   ```

3. **Update create page**:

   ```tsx
   import DashboardForm from "@/app/ui/dashboard/form";
   import { [entity]FormFields, [entity]FormHandler } from "@/app/ui/dashboard/config";

   <DashboardForm fields={[entity]FormFields} mode="create" ... />
   ```

4. **Update edit page**:

   ```tsx
   import DashboardForm from "@/app/ui/dashboard/form";
   import { [entity]FormFields, [entity]FormHandler } from "@/app/ui/dashboard/config";

   <DashboardForm fields={[entity]FormFields} mode="edit" initialData={data} ... />
   ```

5. **Delete old files**:
   ```bash
   rm app/ui/[entity]/table.tsx
   rm app/ui/[entity]/form.tsx
   rm app/ui/[entity]/breadcrumbs.tsx
   ```

Done! ✅

---

## Special Cases

### Entities with Image Upload

Use `customContent` prop:

```tsx
<DashboardForm
  fields={teamsFormFields}
  mode="create"
  onSubmit={teamsFormHandler}
  cancelPath="/dashboard/teams"
  entityName="Team"
  customContent={<ImageUpload onUploadComplete={setImageUrl} />}
/>
```

### Entities with Gallery

```tsx
<DashboardForm
  fields={productsFormFields}
  mode="create"
  onSubmit={productsFormHandler}
  cancelPath="/dashboard/products"
  entityName="Product"
  customContent={
    <MultipleImageUpload
      onImagesChange={setGalleryImages}
      initialImages={initialImages}
    />
  }
/>
```

---

## Summary

**Before:** Each entity had 3-4 separate files (table, form, breadcrumbs, buttons)

**After:** All entities use the same 3 components with configuration:

- `table.tsx` (ONE file)
- `form.tsx` (ONE file)
- `config.tsx` (ONE file with all configs)

**Total:** 3 files for EVERYTHING! 🎉

