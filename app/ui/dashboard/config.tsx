/**
 * Centralized configuration for all dashboard tables and forms
 * Import and use these configurations directly in your pages
 */

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  deleteProduct,
  deleteProject,
  deleteProperty,
  deleteTeam,
  deleteBanner,
  deleteAudio,
  deleteEvent,
  updateEvent,
  deleteQuote,
  deleteSpecialProject,
  deleteSocialMedia,
  deleteProjectCategory,
  createProduct,
  updateProduct,
  createProject,
  updateProject,
  createProperty,
  updateProperty,
  createTeam,
  updateTeam,
  createBanner,
  updateBanner,
  createAudio,
  updateAudio,
  createEvent,
  createQuote,
  updateQuote,
  createSpecialProject,
  updateSpecialProject,
  createSocialMedia,
  updateSocialMedia,
} from "@/app/lib/actions";
import { formatDateToLocal } from "@/app/lib/utils";
import { Column, ActionButton } from "./table";
import { FormField } from "./form";
import {
  Product,
  Project,
  Property,
  TeamField,
  Banner,
  Audio,
  Event,
  Quote,
  SpecialProjects,
  SocialMedia,
} from "@/app/lib/definitions";

// ============================================================================
// TABLE CONFIGURATIONS
// ============================================================================

// PRODUCTS TABLE
export const productsTableConfig = {
  columns: [
    { header: "Product", key: "title_en" },
    { header: "Description", key: "description_en" },
    { header: "Date", key: "gallery_order_index" },
    {
      header: "Order",
      key: "gallery_order_index",
      render: (p: Product) => p.gallery_order_index || "N/A",
    },
  ] as Column<Product>[],
  actions: (product: Product): ActionButton[] => [
    {
      label: "Edit",
      href: `/dashboard/products/${product.id}/edit`,
      icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id: string) => {
        await deleteProduct(id);
      },
      icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
    },
  ],
  viewPath: "/dashboard/products",
  imageField: "gallery_image_url" as keyof Product,
  titleField: "title_en" as keyof Product,
  altTextField: "gallery_alt_text" as keyof Product,
};

// PROJECTS TABLE
export const projectsTableConfig = {
  columns: [
    { header: "Project", key: "title_en" },
    { header: "Description", key: "description_en" },
    {
      header: "Date",
      key: "date",
      render: (p: Project) =>
        typeof p.date === "string"
          ? formatDateToLocal(p.date)
          : (p.date as Date)?.toISOString?.()?.split("T")[0] || "N/A",
    },
    {
      header: "Category",
      key: "category_name",
      render: (p: Project) => p.category_name || "N/A",
    },
    {
      header: "Status",
      key: "project_status",
      render: (p: Project) =>
        p.project_status === 1 ? "Finish" : "InProgress",
    },
    {
      header: "Location",
      key: "location_city_en",
      render: (p: Project) => p.location_city_en || "N/A",
    },
  ] as Column<Project>[],
  actions: (project: Project): ActionButton[] => [
    {
      label: "Edit",
      href: `/dashboard/projects/${project.id}/edit`,
      icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id: string) => {
        await deleteProject(id);
      },
      icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
    },
  ],
  viewPath: "/dashboard/projects",
  imageField: "gallery_image_url" as keyof Project,
  titleField: "title_en" as keyof Project,
  altTextField: "gallery_alt_text" as keyof Project,
};

// PROPERTIES TABLE
export const propertiesTableConfig = {
  columns: [
    { header: "Property Key", key: "key" },
    { header: "Value (English)", key: "value_en" },
    { header: "Value (Kurdish)", key: "value_ku" },
    { header: "Value (Arabic)", key: "value_ar" },
  ] as Column<Property>[],
  actions: (property: Property): ActionButton[] => [
    {
      label: "Edit",
      href: `/dashboard/properties/${property.id}/edit`,
      icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id: string) => {
        await deleteProperty(id);
      },
      icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
    },
  ],
};

// TEAMS TABLE
export const teamsTableConfig = {
  columns: [
    { header: "Name (Kurdish)", key: "name_ku" },
    { header: "Name (Arabic)", key: "name_ar" },
    { header: "Name (English)", key: "name_en" },
    { header: "Position (Kurdish)", key: "position_ku" },
    { header: "Position (Arabic)", key: "position_ar" },
    { header: "Position (English)", key: "position_en" },
  ] as Column<TeamField>[],
  actions: (team: TeamField): ActionButton[] => [
    {
      label: "Edit",
      href: `/dashboard/teams/${team.id}/edit`,
      icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id: string) => {
        await deleteTeam(id);
      },
      icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
    },
  ],
  imageField: "image_url" as keyof TeamField,
  titleField: "name_en" as keyof TeamField,
};

// BANNERS TABLE
export const bannersTableConfig = {
  columns: [
    { header: "Title (English)", key: "title_en" },
    { header: "Type", key: "type" },
    {
      header: "Active",
      key: "is_active",
      render: (b: Banner) => (b.is_active ? "Yes" : "No"),
    },
    { header: "Sort Order", key: "sort_order" },
  ] as Column<Banner>[],
  actions: (banner: Banner): ActionButton[] => [
    {
      label: "Edit",
      href: `/dashboard/banners/${banner.id}/edit`,
      icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id: string) => {
        await deleteBanner(id);
      },
      icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
    },
  ],
};

// AUDIOS TABLE
export const audiosTableConfig = {
  columns: [
    { header: "Title (English)", key: "title_en" },
    { header: "Use For", key: "use_for" },
    {
      header: "Active",
      key: "is_active",
      render: (a: Audio) => (a.is_active ? "Yes" : "No"),
    },
  ] as Column<Audio>[],
  actions: (audio: Audio): ActionButton[] => [
    {
      label: "Edit",
      href: `/dashboard/audios/${audio.id}/edit`,
      icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id: string) => {
        await deleteAudio(id);
      },
      icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
    },
  ],
};

// EVENT TABLE
export const eventTableConfig = {
  columns: [
    { header: "Title", key: "title_en" },
    { header: "Description", key: "description_en" },
    {
      header: "Order",
      key: "gallery_order_index",
      render: (e: Event) => e.gallery_order_index || "N/A",
    },
  ] as Column<Event>[],
  actions: (event: Event): ActionButton[] => [
    {
      label: "Edit",
      href: `/dashboard/event/${event.id}/edit`,
      icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id: string) => {
        await deleteEvent(id);
      },
      icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
    },
  ],
  viewPath: "/dashboard/event",
  imageField: "gallery_image_url" as keyof Event,
  titleField: "title_en" as keyof Event,
  altTextField: "gallery_alt_text" as keyof Event,
};

// ============================================================================
// FORM CONFIGURATIONS
// ============================================================================

// PRODUCTS FORM
export const productsFormFields: FormField[] = [
  {
    name: "title_en",
    label: "Title (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ku",
    label: "Title (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ar",
    label: "Title (Arabic)",
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
    name: "description_ku",
    label: "Description (Kurdish)",
    type: "textarea",
    required: true,
    rows: 4,
    gridCol: "full",
  },
  {
    name: "description_ar",
    label: "Description (Arabic)",
    type: "textarea",
    required: true,
    rows: 4,
    gridCol: "full",
  },
];

export const productsFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateProduct(id, formData);
  } else {
    await createProduct({ message: null, errors: {} }, formData);
  }
};

// PROPERTIES FORM
export const propertiesFormFields: FormField[] = [
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
  {
    name: "value_ku",
    label: "Value (Kurdish)",
    type: "textarea",
    required: true,
    rows: 3,
    gridCol: "half",
  },
  {
    name: "value_ar",
    label: "Value (Arabic)",
    type: "textarea",
    required: true,
    rows: 3,
    gridCol: "half",
  },
];

export const propertiesFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateProperty(id, formData);
  } else {
    await createProperty(formData);
  }
};

// TEAMS FORM
export const teamsFormFields: FormField[] = [
  {
    name: "name_en",
    label: "Name (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "name_ku",
    label: "Name (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "name_ar",
    label: "Name (Arabic)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "position_en",
    label: "Position (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "position_ku",
    label: "Position (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "position_ar",
    label: "Position (Arabic)",
    type: "text",
    required: true,
    gridCol: "half",
  },
];

export const teamsFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateTeam(id, formData);
  } else {
    await createTeam({ message: null, errors: {} }, formData);
  }
};

// AUDIOS FORM
export const audiosFormFields: FormField[] = [
  {
    name: "title_ku",
    label: "Title (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_en",
    label: "Title (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ar",
    label: "Title (Arabic)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "audio_url",
    label: "Audio File",
    type: "file",
    required: false,
    accept: "audio/*,.mp3,.wav,.ogg,.m4a",
    helpText:
      "Upload an audio file (MP3, WAV, OGG, or M4A format). Required for new audio, optional when editing.",
    gridCol: "full",
  },
  {
    name: "use_for",
    label: "Use For",
    type: "select",
    required: true,
    options: [
      { value: "landing", label: "Landing" },
      { value: "intro", label: "Intro" },
      { value: "both", label: "Both" },
    ],
    gridCol: "half",
  },
  {
    name: "is_active",
    label: "Active",
    type: "checkbox",
    defaultValue: true,
    gridCol: "full",
  },
];

export const audiosFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateAudio(id, { message: null, errors: {} }, formData);
  } else {
    await createAudio({ message: null, errors: {} }, formData);
  }
};

// BANNERS FORM
export const bannersFormFields: FormField[] = [
  {
    name: "title_ku",
    label: "Title (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_en",
    label: "Title (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ar",
    label: "Title (Arabic)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    options: [
      { value: "image", label: "Image" },
      { value: "video", label: "Video" },
    ],
    gridCol: "half",
  },
  {
    name: "sort_order",
    label: "Sort Order",
    type: "number",
    required: true,
    defaultValue: 0,
    gridCol: "half",
  },
  {
    name: "is_active",
    label: "Active",
    type: "checkbox",
    defaultValue: true,
    gridCol: "half",
  },
];

export const bannersFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateBanner(id, formData);
  } else {
    await createBanner({ message: null, errors: {} }, formData);
  }
};

// QUOTES FORM
export const quotesFormFields: FormField[] = [
  {
    name: "title_ku",
    label: "Title (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_en",
    label: "Title (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ar",
    label: "Title (Arabic)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "image_url",
    label: "Quote Image",
    type: "file",
    required: false,
    gridCol: "full",
    helpText: "Upload an image for this quote (optional for updates)",
  },
];

export const quotesFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  try {
    if (mode === "edit" && id) {
      const result = await updateQuote(id, formData);
      if (result && result.errors) {
        throw new Error(result.message || "Update failed");
      }
    } else {
      const result = await createQuote({ message: null, errors: {} }, formData);
      if (result && result.errors) {
        throw new Error(result.message || "Creation failed");
      }
    }
  } catch (error) {
    // Re-throw the error so the form can handle it
    throw error;
  }
};

// EVENT FORM
export const eventFormFields: FormField[] = [
  {
    name: "title_en",
    label: "Title (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ku",
    label: "Title (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ar",
    label: "Title (Arabic)",
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
    name: "description_ku",
    label: "Description (Kurdish)",
    type: "textarea",
    required: true,
    rows: 4,
    gridCol: "full",
  },
  {
    name: "description_ar",
    label: "Description (Arabic)",
    type: "textarea",
    required: true,
    rows: 4,
    gridCol: "full",
  },
];

export const eventFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateEvent(id, formData);
  } else {
    await createEvent({ message: null, errors: {} }, formData);
  }
};

// SOCIAL FORM
export const socialFormFields: FormField[] = [
  {
    name: "title_ku",
    label: "Title (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_en",
    label: "Title (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ar",
    label: "Title (Arabic)",
    type: "text",
    required: true,
    gridCol: "half",
  },
];

export const socialFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateQuote(id, formData);
  } else {
    await createQuote({ message: null, errors: {} }, formData);
  }
};

// SOCIAL MEDIA FORM
export const socialMediaFormFields: FormField[] = [
  {
    name: "type",
    label: "Social Media Type",
    type: "select",
    required: true,
    options: [
      { value: "0", label: "Instagram" },
      { value: "1", label: "Facebook" },
      { value: "2", label: "X (Twitter)" },
    ],
    gridCol: "half",
  },
  {
    name: "url",
    label: "URL",
    type: "text",
    required: true,
    placeholder: "Enter social media URL",
    gridCol: "half",
  },
];

export const socialMediaFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateSocialMedia(id, formData);
  } else {
    await createSocialMedia({ message: null, errors: {} }, formData);
  }
};

export const specialProjectsFormHandler = async (
  mode: "create" | "edit",
  id: string | undefined,
  formData: FormData
) => {
  if (mode === "edit" && id) {
    await updateSpecialProject(id, formData);
  } else {
    await createSpecialProject({ message: null, errors: {} }, formData);
  }
};

// PROJECT CATEGORY TABLE
export const projectCategoryTableConfig = {
  columns: [
    {
      header: "English Title",
      key: "title_en",
      render: (item: any) => item.title_en,
    },
    {
      header: "Kurdish Title",
      key: "title_ku",
      render: (item: any) => item.title_ku,
    },
    {
      header: "Arabic Title",
      key: "title_ar",
      render: (item: any) => item.title_ar,
    },
  ] as Column<any>[],
  actions: (item: any): ActionButton[] => [
    {
      label: "Edit",
      href: `/dashboard/project-category/${item.id}/edit`,
      icon: <PencilIcon className="w-5 text-blue-500 dark:text-blue-400" />,
    },
    {
      label: "Delete",
      form: true,
      onClick: async (id: string) => {
        await deleteProjectCategory(id);
      },
      icon: <TrashIcon className="w-5 text-red-500 dark:text-red-400" />,
    },
  ],
};

// PROJECT CATEGORY FORM
export const projectCategoryFormFields: FormField[] = [
  {
    name: "title_en",
    label: "Title (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ku",
    label: "Title (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ar",
    label: "Title (Arabic)",
    type: "text",
    required: true,
    gridCol: "half",
  },
];

// PROJECTS FORM
export const projectsFormFields: FormField[] = [
  {
    name: "title_en",
    label: "Title (English)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ku",
    label: "Title (Kurdish)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "title_ar",
    label: "Title (Arabic)",
    type: "text",
    required: true,
    gridCol: "half",
  },
  {
    name: "description_en",
    label: "Description (English)",
    type: "textarea",
    required: true,
    gridCol: "full",
  },
  {
    name: "description_ku",
    label: "Description (Kurdish)",
    type: "textarea",
    required: true,
    gridCol: "full",
  },
  {
    name: "description_ar",
    label: "Description (Arabic)",
    type: "textarea",
    required: true,
    gridCol: "full",
  },
  {
    name: "date",
    label: "Project Date",
    type: "date",
    required: true,
    gridCol: "half",
  },
  {
    name: "project_category",
    label: "Category",
    type: "select",
    required: true,
    gridCol: "half",
    options: [], // Will be populated dynamically
  },
  {
    name: "location_id",
    label: "Location",
    type: "select",
    required: true,
    gridCol: "half",
    options: [], // Will be populated dynamically
  },
  {
    name: "project_status",
    label: "Status",
    type: "select",
    required: true,
    gridCol: "half",
    options: [
      { value: "0", label: "Inactive" },
      { value: "1", label: "Active" },
    ],
  },
];
