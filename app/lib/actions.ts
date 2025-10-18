"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getConnection } from "./serverutils";
import { redirect } from "next/navigation";
import { deleteCloudFile } from "./cloud-storage";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import {
  ParentType,
  Property,
  SocialMedia,
  SocialMediaType,
  Banner,
  Audio,
} from "./definitions";

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a teams.",
  }),
  amount: z.coerce.number().gt(0, {
    message: "Please enter an amount greater than $0.",
  }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];
  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      "INSERT INTO invoices (customer_id, amount, status, date) VALUES (?, ?, ?, ?)",
      [customerId, amountInCents, status, date]
    );
    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Create Invoice.", error);
    throw new Error("Failed to create invoice");
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });
  const amountInCents = amount * 100;

  try {
    const connection = await getConnection();
    await connection.execute(
      "UPDATE invoices SET customer_id = ?, amount = ?, status = ? WHERE id = ?",
      [customerId, amountInCents, status, id]
    );
    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Update Invoice.", error);
    throw new Error("Failed to update invoice");
  }
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

export async function deleteInvoice(id: string) {
  const connection = await getConnection();
  await connection.execute("DELETE FROM invoices WHERE id = ?", [id]);
  await connection.commit();
  revalidatePath("/dashboard/invoices");
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

const CreateTeam = z.object({
  name_ku: z.string().min(1, "Name is required"),
  name_ar: z.string().min(1, "Name is required"),
  name_en: z.string().min(1, "Name is required"),
  position_ku: z.string().min(1, "Position is required"),
  position_ar: z.string().min(1, "Position is required"),
  position_en: z.string().min(1, "Position is required"),
  image_url: z.string().min(1, "Image is required"),
  special: z.string().min(1, "Special is required"),
});

export async function createTeam(prevState: TeamState, formData: FormData) {
  const validatedFields = CreateTeam.safeParse({
    name_ku: formData.get("name_ku"),
    name_ar: formData.get("name_ar"),
    name_en: formData.get("name_en"),
    position_ku: formData.get("position_ku"),
    position_ar: formData.get("position_ar"),
    position_en: formData.get("position_en"),
    image_url: formData.get("image_url"),
    special: formData.get("special"),
  });

  if (!validatedFields.success) {
    console.log(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Team.",
    };
  }

  const {
    name_ku,
    name_ar,
    name_en,
    position_ku,
    position_ar,
    position_en,
    image_url,
    special,
  } = validatedFields.data;
  try {
    const connection = await getConnection();
    await connection.execute(
      "INSERT INTO teams (name_ku, name_ar, name_en, position_ku, position_ar, position_en, image_url, special) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name_ku,
        name_ar,
        name_en,
        position_ku,
        position_ar,
        position_en,
        image_url,
        special,
      ]
    );
    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Create Team.", error);
    return {
      errors: {},
      message: "Database Error: Failed to create team.",
    };
  }
  revalidatePath("/dashboard/teams");
  redirect("/dashboard/teams");
}

export type TeamState = {
  errors?: {
    name_ku?: string[];
    name_ar?: string[];
    name_en?: string[];
    position_ku?: string[];
    position_ar?: string[];
    position_en?: string[];
    image_url?: string[];
    special?: string[];
  };
  message?: string | null;
};

export async function updateTeam(id: string, formData: FormData) {
  const {
    name_ku,
    name_ar,
    name_en,
    position_ku,
    position_ar,
    position_en,
    image_url,
    special,
  } = CreateTeam.parse({
    name_ku: formData.get("name_ku"),
    name_ar: formData.get("name_ar"),
    name_en: formData.get("name_en"),
    position_ku: formData.get("position_ku"),
    position_ar: formData.get("position_ar"),
    position_en: formData.get("position_en"),
    image_url: formData.get("image_url"),
    special: formData.get("special"),
  });

  try {
    const connection = await getConnection();

    // Update the team with new data
    await connection.execute(
      "UPDATE teams SET name_ku = ?, name_ar = ?, name_en = ?, position_ku = ?, position_ar = ?, position_en = ?, image_url = ?, special = ? WHERE id = ?",
      [
        name_ku,
        name_ar,
        name_en,
        position_ku,
        position_ar,
        position_en,
        image_url,
        special,
        id,
      ]
    );

    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Update Team.", error);
    throw new Error("Failed to update team");
  }
  revalidatePath("/dashboard/teams");
  redirect("/dashboard/teams");
}

export async function deleteTeam(id: string) {
  const connection = await getConnection();
  const [result] = (await connection.execute(
    "SELECT image_url FROM teams WHERE id = ?",
    [id]
  )) as any[];
  const imageUrl = result[0]?.image_url;
  if (imageUrl) {
    await deleteCloudFile(imageUrl);
  }
  await connection.execute("DELETE FROM teams WHERE id = ?", [id]);
  await connection.commit();
  revalidatePath("/dashboard/teams");
}

const CreateProject = z.object({
  title_ku: z.string().min(1, "Title is required"),
  title_ar: z.string().min(1, "Title is required"),
  title_en: z.string().min(1, "Title is required"),
  description_ku: z.string().min(1, "Description is required"),
  description_ar: z.string().min(1, "Description is required"),
  description_en: z.string().min(1, "Description is required"),
  date: z.string(),
  image_url: z.string().optional(),
  alt_text: z.string().optional(),
  order_index: z.string().optional(),
});

export type ProjectState = {
  errors?: {
    title_ku?: string[];
    title_ar?: string[];
    title_en?: string[];
    description_ku?: string[];
    description_ar?: string[];
    description_en?: string[];
    date?: string[];
    image_url?: string[];
    alt_text?: string[];
    order_index?: string[];
  };
  message?: string | null;
};
export async function createProject(
  prevState: ProjectState,
  formData: FormData
) {
  // Debug logging for development
  console.log("Creating project with form data");
  console.log(
    "Gallery images count:",
    formData.getAll("gallery_url_0").length > 0 ? "Yes" : "No"
  );

  const validatedFields = CreateProject.safeParse({
    title_ku: formData.get("title_ku"),
    title_ar: formData.get("title_ar"),
    title_en: formData.get("title_en"),
    description_ku: formData.get("description_ku"),
    description_ar: formData.get("description_ar"),
    description_en: formData.get("description_en"),
    date: formData.get("date"),
    image_url: formData.get("image_url"),
    alt_text: formData.get("alt_text"),
    order_index: formData.get("order_index"),
  });

  if (!validatedFields.success) {
    console.log(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Project.",
    };
  }

  const {
    title_ku,
    title_ar,
    title_en,
    description_ku,
    description_ar,
    description_en,
    date,
    image_url,
    alt_text,
    order_index,
  } = validatedFields.data;

  try {
    const connection = await getConnection();

    // Insert only the basic project fields into projects table
    const [result] = await connection.execute(
      "INSERT INTO projects (title_ku, title_ar, title_en, description_ku, description_ar, description_en, date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        title_ku,
        title_ar,
        title_en,
        description_ku,
        description_ar,
        description_en,
        date,
      ]
    );

    // Type assertion for the result to access insertId
    const insertResult = result as any;
    const projectId = insertResult.insertId;

    // Collect all gallery images to insert
    const galleryImages: {
      url: string;
      altText: string;
      orderIndex: string;
    }[] = [];

    console.log("Processing gallery images...");

    // Add main image if it exists
    if (image_url && alt_text && order_index) {
      galleryImages.push({
        url: image_url.toString(),
        altText: alt_text.toString(),
        orderIndex: order_index.toString(),
      });
    }

    // Collect additional gallery images
    let index = 0;
    while (true) {
      const galleryUrl = formData.get(`gallery_url_${index}`);
      const galleryAlt = formData.get(`gallery_alt_${index}`);
      const galleryOrder = formData.get(`gallery_order_${index}`);

      if (!galleryUrl || !galleryAlt || !galleryOrder) {
        break;
      }

      // Skip if this is the main image (already added above)
      if (galleryUrl === image_url) {
        index++;
        continue;
      }

      galleryImages.push({
        url: galleryUrl.toString(),
        altText: galleryAlt.toString(),
        orderIndex: galleryOrder.toString(),
      });

      index++;
    }

    console.log("Collected gallery images:", galleryImages.length);

    // Remove duplicates based on URL
    const uniqueImages = galleryImages.filter(
      (image, index, self) =>
        index === self.findIndex((img) => img.url === image.url)
    );

    console.log("Unique gallery images after deduplication:", uniqueImages);

    // Get the maximum order_index for this specific parent
    const [maxOrderResult] = (await connection.execute(
      "SELECT MAX(CAST(order_index AS UNSIGNED)) as max_order FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [projectId, ParentType.Project.toString()]
    )) as any[];
    let nextOrderIndex = (maxOrderResult[0]?.max_order || 0) + 1;

    // Insert all unique gallery images
    for (const image of uniqueImages) {
      console.log(
        "Inserting gallery image:",
        image,
        "with order_index:",
        nextOrderIndex
      );
      await connection.execute(
        "INSERT INTO galleries (parent_id, parent_type, image_url, alt_text, order_index) VALUES (?, ?, ?, ?, ?)",
        [
          projectId,
          ParentType.Project.toString(),
          image.url,
          image.altText,
          nextOrderIndex.toString(),
        ]
      );
      nextOrderIndex++;
    }

    console.log(`Successfully inserted ${uniqueImages.length} gallery images`);

    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Create Project.", error);
    return {
      errors: {},
      message: "Database Error: Failed to create project.",
    };
  }
  revalidatePath("/dashboard/projects");
  // Remove redirect since this is called from client component
  // redirect("/dashboard/projects");
}

export async function updateProject(id: string, formData: FormData) {
  console.log("updateProject called with id:", id);

  try {
    // Log all form data for debugging
    console.log("Form data received:", {
      title_ku: formData.get("title_ku"),
      title_ar: formData.get("title_ar"),
      title_en: formData.get("title_en"),
      description_ku: formData.get("description_ku"),
      description_ar: formData.get("description_ar"),
      description_en: formData.get("description_en"),
      date: formData.get("date"),
      image_url: formData.get("image_url"),
      alt_text: formData.get("alt_text"),
      order_index: formData.get("order_index"),
    });

    let validatedData;
    try {
      validatedData = CreateProject.parse({
        title_ku: formData.get("title_ku"),
        title_ar: formData.get("title_ar"),
        title_en: formData.get("title_en"),
        description_ku: formData.get("description_ku"),
        description_ar: formData.get("description_ar"),
        description_en: formData.get("description_en"),
        date: formData.get("date"),
        image_url: formData.get("image_url"),
        alt_text: formData.get("alt_text"),
        order_index: formData.get("order_index"),
      });
    } catch (validationError) {
      console.error("Schema validation failed:", validationError);
      throw new Error(`Validation failed: ${validationError}`);
    }

    const {
      title_ku,
      title_ar,
      title_en,
      description_ku,
      description_ar,
      description_en,
      date,
      image_url,
      alt_text,
      order_index,
    } = validatedData;

    console.log("Parsed project data:", {
      title_en,
      image_url,
      alt_text,
      order_index,
    });

    const connection = await getConnection();

    // Update the project with new data
    await connection.execute(
      "UPDATE projects SET title_ku = ?, title_ar = ?, title_en = ?, description_ku = ?, description_ar = ?, description_en = ?, date = ? WHERE id = ?",
      [
        title_ku,
        title_ar,
        title_en,
        description_ku,
        description_ar,
        description_en,
        date,
        id,
      ]
    );

    console.log("Project updated successfully");

    // Clear existing gallery entries for this project
    await connection.execute(
      "DELETE FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Project.toString()]
    );

    console.log("Existing gallery entries cleared");

    // Collect all gallery images to insert
    const galleryImages: {
      url: string;
      altText: string;
      orderIndex: string;
    }[] = [];

    // Add main image if it exists
    if (image_url && alt_text && order_index) {
      galleryImages.push({
        url: image_url.toString(),
        altText: alt_text.toString(),
        orderIndex: order_index.toString(),
      });
    }

    // Collect additional gallery images
    let index = 0;
    while (true) {
      const galleryUrl = formData.get(`gallery_url_${index}`);
      const galleryAlt = formData.get(`gallery_alt_${index}`);
      const galleryOrder = formData.get(`gallery_order_${index}`);

      if (!galleryUrl || !galleryAlt || !galleryOrder) {
        break;
      }

      // Skip if this is the main image (already added above)
      if (galleryUrl === image_url) {
        index++;
        continue;
      }

      galleryImages.push({
        url: galleryUrl.toString(),
        altText: galleryAlt.toString(),
        orderIndex: galleryOrder.toString(),
      });

      index++;
    }

    console.log("Gallery images to insert:", galleryImages);

    // Remove duplicates based on URL
    const uniqueImages = galleryImages.filter(
      (image, index, self) =>
        index === self.findIndex((img) => img.url === image.url)
    );

    console.log("Unique gallery images after deduplication:", uniqueImages);

    // Get the maximum order_index for this specific parent
    const [maxOrderResult] = (await connection.execute(
      "SELECT MAX(CAST(order_index AS UNSIGNED)) as max_order FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Project.toString()]
    )) as any[];
    let nextOrderIndex = (maxOrderResult[0]?.max_order || 0) + 1;

    // Insert all unique gallery images
    for (const image of uniqueImages) {
      console.log(
        "Inserting gallery image:",
        image,
        "with order_index:",
        nextOrderIndex
      );
      await connection.execute(
        "INSERT INTO galleries (parent_id, parent_type, image_url, alt_text, order_index) VALUES (?, ?, ?, ?, ?)",
        [
          id,
          ParentType.Project.toString(),
          image.url,
          image.altText,
          nextOrderIndex.toString(),
        ]
      );
      nextOrderIndex++;
    }

    console.log("Gallery images inserted successfully");

    await connection.commit();
    console.log("Project update completed successfully");
  } catch (error) {
    console.error("Database Error: Failed to Update Project.", error);
    throw new Error("Failed to update project");
  }
  revalidatePath("/dashboard/projects");
  // Remove redirect since this is called from client component
  // redirect("/dashboard/projects");
}

export async function deleteProject(id: string) {
  const connection = await getConnection();

  try {
    // Get all gallery images for this project before deletion
    const [galleryResult] = (await connection.execute(
      "SELECT image_url FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Project.toString()]
    )) as any[];

    // Delete the gallery entries first
    await connection.execute(
      "DELETE FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Project.toString()]
    );

    // Delete the project
    await connection.execute("DELETE FROM projects WHERE id = ?", [id]);

    // Delete the images from cloud storage if they exist
    if (galleryResult && galleryResult.length > 0) {
      for (const row of galleryResult) {
        if (row.image_url) {
          await deleteCloudFile(row.image_url);
        }
      }
    }

    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Delete Project.", error);
    await connection.rollback();
    throw new Error("Failed to delete project");
  } finally {
    await connection.end();
  }

  revalidatePath("/dashboard/projects");
}

//create Blog

const CreateBlog = z.object({
  title_ku: z.string().min(1, "Title is required"),
  title_ar: z.string().min(1, "Title is required"),
  title_en: z.string().min(1, "Title is required"),
  description_ku: z.string().min(1, "Description is required"),
  description_ar: z.string().min(1, "Description is required"),
  description_en: z.string().min(1, "Description is required"),
});

export async function createBlog(prevState: BlogState, formData: FormData) {
  // Debug logging for development
  console.log("Creating blog with form data");
  console.log(
    "Gallery images count:",
    formData.getAll("gallery_url_0").length > 0 ? "Yes" : "No"
  );

  const validatedFields = CreateBlog.safeParse({
    title_ku: formData.get("title_ku"),
    title_ar: formData.get("title_ar"),
    title_en: formData.get("title_en"),
    description_ku: formData.get("description_ku"),
    description_ar: formData.get("description_ar"),
    description_en: formData.get("description_en"),
  });

  if (!validatedFields.success) {
    console.log(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Blog.",
    };
  }

  const {
    title_ku,
    title_ar,
    title_en,
    description_ku,
    description_ar,
    description_en,
  } = validatedFields.data;

  // Extract main image data (can be empty)
  const image_url = formData.get("image_url");
  const alt_text = formData.get("alt_text");
  const order_index = formData.get("order_index");

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Insert blog record
    const [result] = await connection.execute(
      "INSERT INTO blogs (title_ku, title_ar, title_en, description_ku, description_ar, description_en) VALUES (?, ?, ?, ?, ?, ?)",
      [
        title_ku,
        title_ar,
        title_en,
        description_ku,
        description_ar,
        description_en,
      ]
    );

    const blogId = (result as any).insertId;
    console.log("Blog created with ID:", blogId);

    // Collect gallery images (similar to project logic)
    const galleryImages: {
      url: string;
      altText: string;
      orderIndex: string;
    }[] = [];

    console.log("Processing gallery images...");

    // Add main image if it exists
    if (image_url && alt_text && order_index) {
      galleryImages.push({
        url: image_url.toString(),
        altText: alt_text.toString(),
        orderIndex: order_index.toString(),
      });
    }

    // Collect additional gallery images
    let index = 0;
    while (true) {
      const galleryUrl = formData.get(`gallery_url_${index}`);
      const galleryAlt = formData.get(`gallery_alt_${index}`);
      const galleryOrder = formData.get(`gallery_order_${index}`);

      if (!galleryUrl || !galleryAlt || !galleryOrder) {
        break;
      }

      // Skip if this is the main image (already added above)
      if (galleryUrl === image_url) {
        index++;
        continue;
      }

      galleryImages.push({
        url: galleryUrl.toString(),
        altText: galleryAlt.toString(),
        orderIndex: galleryOrder.toString(),
      });

      index++;
    }

    console.log("Collected gallery images:", galleryImages.length);

    // Remove duplicates based on URL
    const uniqueImages = galleryImages.filter(
      (image, index, self) =>
        index === self.findIndex((img) => img.url === image.url)
    );

    console.log("Unique gallery images after deduplication:", uniqueImages);

    // Get the maximum order_index for this specific parent
    const [maxOrderResult] = (await connection.execute(
      "SELECT MAX(CAST(order_index AS UNSIGNED)) as max_order FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [blogId, ParentType.Blog.toString()]
    )) as any[];
    let nextOrderIndex = (maxOrderResult[0]?.max_order || 0) + 1;

    // Insert all unique gallery images
    for (const image of uniqueImages) {
      console.log(
        "Inserting gallery image:",
        image,
        "with order_index:",
        nextOrderIndex
      );
      await connection.execute(
        "INSERT INTO galleries (parent_id, parent_type, image_url, alt_text, order_index) VALUES (?, ?, ?, ?, ?)",
        [
          blogId,
          ParentType.Blog.toString(),
          image.url,
          image.altText,
          nextOrderIndex.toString(),
        ]
      );
      nextOrderIndex++;
    }

    console.log(`Successfully inserted ${uniqueImages.length} gallery images`);

    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Create Blog.", error);
    return {
      errors: {},
      message: "Database Error: Failed to create blog.",
    };
  }
  revalidatePath("/dashboard/blogs");
  redirect("/dashboard/blogs");
}

export type BlogState = {
  errors?: {
    title_ku?: string[];
    title_ar?: string[];
    title_en?: string[];
    description_ku?: string[];
    description_ar?: string[];
    description_en?: string[];
  };
  message?: string | null;
};

export async function updateBlog(id: string, formData: FormData) {
  console.log("updateBlog called with id:", id);

  const validatedFields = CreateBlog.safeParse({
    title_ku: formData.get("title_ku"),
    title_ar: formData.get("title_ar"),
    title_en: formData.get("title_en"),
    description_ku: formData.get("description_ku"),
    description_ar: formData.get("description_ar"),
    description_en: formData.get("description_en"),
  });

  if (!validatedFields.success) {
    console.log(
      "Validation failed:",
      validatedFields.error.flatten().fieldErrors
    );
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Blog.",
    };
  }

  const {
    title_ku,
    title_ar,
    title_en,
    description_ku,
    description_ar,
    description_en,
  } = validatedFields.data;

  // Extract main image data (can be empty)
  const image_url = formData.get("image_url");
  const alt_text = formData.get("alt_text");
  const order_index = formData.get("order_index");

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Update blog record
    await connection.execute(
      "UPDATE blogs SET title_ku = ?, title_ar = ?, title_en = ?, description_ku = ?, description_ar = ?, description_en = ? WHERE id = ?",
      [
        title_ku,
        title_ar,
        title_en,
        description_ku,
        description_ar,
        description_en,
        id,
      ]
    );

    console.log("Blog updated successfully");

    // Clear existing gallery entries for this blog
    await connection.execute(
      "DELETE FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Blog.toString()]
    );

    console.log("Existing gallery entries cleared");

    // Collect gallery images (similar to project logic)
    const galleryImages: {
      url: string;
      altText: string;
      orderIndex: string;
    }[] = [];

    // Add main image if it exists
    if (image_url && alt_text && order_index) {
      galleryImages.push({
        url: image_url.toString(),
        altText: alt_text.toString(),
        orderIndex: order_index.toString(),
      });
    }

    // Collect additional gallery images
    let index = 0;
    while (true) {
      const galleryUrl = formData.get(`gallery_url_${index}`);
      const galleryAlt = formData.get(`gallery_alt_${index}`);
      const galleryOrder = formData.get(`gallery_order_${index}`);

      if (!galleryUrl || !galleryAlt || !galleryOrder) {
        break;
      }

      // Skip if this is the main image (already added above)
      if (galleryUrl === image_url) {
        index++;
        continue;
      }

      galleryImages.push({
        url: galleryUrl.toString(),
        altText: galleryAlt.toString(),
        orderIndex: galleryOrder.toString(),
      });

      index++;
    }

    console.log("Gallery images to insert:", galleryImages);

    // Remove duplicates based on URL
    const uniqueImages = galleryImages.filter(
      (image, index, self) =>
        index === self.findIndex((img) => img.url === image.url)
    );

    console.log("Unique gallery images after deduplication:", uniqueImages);

    // Get the maximum order_index for this specific parent
    const [maxOrderResult] = (await connection.execute(
      "SELECT MAX(CAST(order_index AS UNSIGNED)) as max_order FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Blog.toString()]
    )) as any[];
    let nextOrderIndex = (maxOrderResult[0]?.max_order || 0) + 1;

    // Insert all unique gallery images
    for (const image of uniqueImages) {
      console.log(
        "Inserting gallery image:",
        image,
        "with order_index:",
        nextOrderIndex
      );
      await connection.execute(
        "INSERT INTO galleries (parent_id, parent_type, image_url, alt_text, order_index) VALUES (?, ?, ?, ?, ?)",
        [
          id,
          ParentType.Blog.toString(),
          image.url,
          image.altText,
          nextOrderIndex.toString(),
        ]
      );
      nextOrderIndex++;
    }

    console.log("Gallery images inserted successfully");

    await connection.commit();
    console.log("Blog update completed successfully");
  } catch (error) {
    console.error("Database Error: Failed to Update Blog.", error);
    throw new Error("Failed to update blog");
  }
  revalidatePath("/dashboard/blogs");
  // Remove redirect since this is called from client component
}

export async function deleteBlog(id: string) {
  try {
    const connection = await getConnection();
    await connection.beginTransaction();

    console.log("Deleting blog and associated gallery images for ID:", id);

    // First, get all gallery images for this blog to delete from cloud storage
    const [galleries] = (await connection.execute(
      "SELECT image_url FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Blog.toString()]
    )) as any[];

    // Delete images from cloud storage
    for (const gallery of galleries) {
      try {
        await deleteCloudFile(gallery.image_url);
        console.log("Deleted cloud storage image:", gallery.image_url);
      } catch (error) {
        console.error(
          "Failed to delete cloud storage image:",
          gallery.image_url,
          error
        );
        // Continue with deletion even if cloud storage deletion fails
      }
    }

    // Delete gallery entries from database
    await connection.execute(
      "DELETE FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Blog.toString()]
    );

    // Delete the blog record
    await connection.execute("DELETE FROM blogs WHERE id = ?", [id]);

    await connection.commit();
    console.log("Blog and gallery images deleted successfully");
  } catch (error) {
    console.error("Database Error: Failed to Delete Blog.", error);
    throw new Error("Failed to delete blog");
  }
  revalidatePath("/dashboard/blogs");
}

//create Product
const CreateProduct = z.object({
  title_ar: z.string().min(1, "Title is required"),
  title_en: z.string().min(1, "Title is required"),
  title_ku: z.string().min(1, "Title is required"),
  description_ar: z.string().min(1, "Description is required"),
  description_en: z.string().min(1, "Description is required"),
  description_ku: z.string().min(1, "Description is required"),
});

export async function createProduct(
  prevState: ProductState,
  formData: FormData
) {
  // Debug logging for development
  console.log("Creating product with form data");
  console.log(
    "Form data entries:",
    Array.from(formData.entries()).map(([key, value]) => [key, value])
  );

  const validatedFields = CreateProduct.safeParse({
    title_ku: formData.get("title_ku"),
    title_ar: formData.get("title_ar"),
    title_en: formData.get("title_en"),
    description_ku: formData.get("description_ku"),
    description_ar: formData.get("description_ar"),
    description_en: formData.get("description_en"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Product.",
    };
  }

  const {
    title_ku,
    title_ar,
    title_en,
    description_ku,
    description_ar,
    description_en,
  } = validatedFields.data;

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Insert product record
    const [result] = await connection.execute(
      "INSERT INTO products (title_ku, title_ar, title_en, description_ku, description_ar, description_en) VALUES (?, ?, ?, ?, ?, ?)",
      [
        title_ku,
        title_ar,
        title_en,
        description_ku,
        description_ar,
        description_en,
      ]
    );

    const productId = (result as mysql.ResultSetHeader).insertId;

    // Handle gallery images
    const galleryEntries = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith("gallery_")
    );

    if (galleryEntries.length > 0) {
      const galleryImages: {
        url: string;
        alt: string;
        order: number;
      }[] = [];

      // Group gallery data by index
      const galleryData: { [key: number]: any } = {};
      galleryEntries.forEach(([key, value]) => {
        const match = key.match(/gallery_(\w+)_(\d+)/);
        if (match) {
          const [, field, index] = match;
          const idx = parseInt(index);
          if (!galleryData[idx]) galleryData[idx] = {};
          galleryData[idx][field] = value;
        }
      });

      // Convert to array format
      Object.keys(galleryData).forEach((key) => {
        const data = galleryData[parseInt(key)];
        if (data.url) {
          galleryImages.push({
            url: data.url,
            alt: data.alt || "",
            order: parseInt(data.order) || 1,
          });
        }
      });

      // Insert gallery images
      for (const image of galleryImages) {
        await connection.execute(
          "INSERT INTO galleries (parent_id, parent_type, image_url, alt_text, order_index) VALUES (?, ?, ?, ?, ?)",
          [productId, ParentType.Product, image.url, image.alt, image.order]
        );
      }
    }

    await connection.commit();
    console.log("Product created successfully with ID:", productId);
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Create Product.", error);
    throw new Error("Failed to create product");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export type ProductState = {
  errors?: {
    title_ku?: string[];
    title_ar?: string[];
    title_en?: string[];
    description_ku?: string[];
    description_ar?: string[];
    description_en?: string[];
  };
  message?: string | null;
};

export async function updateProduct(id: string, formData: FormData) {
  console.log("updateProduct called with id:", id);

  const validatedFields = CreateProduct.safeParse({
    title_ku: formData.get("title_ku"),
    title_ar: formData.get("title_ar"),
    title_en: formData.get("title_en"),
    description_ku: formData.get("description_ku"),
    description_ar: formData.get("description_ar"),
    description_en: formData.get("description_en"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Product.",
    };
  }

  const {
    title_ku,
    title_ar,
    title_en,
    description_ku,
    description_ar,
    description_en,
  } = validatedFields.data;

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Update product record
    await connection.execute(
      "UPDATE products SET title_ku = ?, title_ar = ?, title_en = ?, description_ku = ?, description_ar = ?, description_en = ? WHERE id = ?",
      [
        title_ku,
        title_ar,
        title_en,
        description_ku,
        description_ar,
        description_en,
        id,
      ]
    );

    // Handle gallery images - delete existing ones first
    await connection.execute(
      "DELETE FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Product]
    );

    // Handle new gallery images
    const galleryEntries = Array.from(formData.entries()).filter(([key]) =>
      key.startsWith("gallery_")
    );

    if (galleryEntries.length > 0) {
      const galleryImages: {
        url: string;
        alt: string;
        order: number;
      }[] = [];

      // Group gallery data by index
      const galleryData: { [key: number]: any } = {};
      galleryEntries.forEach(([key, value]) => {
        const match = key.match(/gallery_(\w+)_(\d+)/);
        if (match) {
          const [, field, index] = match;
          const idx = parseInt(index);
          if (!galleryData[idx]) galleryData[idx] = {};
          galleryData[idx][field] = value;
        }
      });

      // Convert to array format
      Object.keys(galleryData).forEach((key) => {
        const data = galleryData[parseInt(key)];
        if (data.url) {
          galleryImages.push({
            url: data.url,
            alt: data.alt || "",
            order: parseInt(data.order) || 1,
          });
        }
      });

      // Insert new gallery images
      for (const image of galleryImages) {
        await connection.execute(
          "INSERT INTO galleries (parent_id, parent_type, image_url, alt_text, order_index) VALUES (?, ?, ?, ?, ?)",
          [id, ParentType.Product, image.url, image.alt, image.order]
        );
      }
    }

    await connection.commit();
    console.log("Product updated successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Update Product.", error);
    throw new Error("Failed to update product");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/products");
  redirect("/dashboard/products");
}

export async function deleteProduct(id: string) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Delete gallery images first
    await connection.execute(
      "DELETE FROM galleries WHERE parent_id = ? AND parent_type = ?",
      [id, ParentType.Product]
    );

    // Delete product
    await connection.execute("DELETE FROM products WHERE id = ?", [id]);

    await connection.commit();
    console.log("Product deleted successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Delete Product.", error);
    throw new Error("Failed to delete product");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/products");
}

// Quote CRUD Operations
const CreateQuote = z.object({
  title_ku: z.string().min(1, "Kurdish title is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  image_url: z.string().min(1, "Image is required"),
});

export type QuoteState = {
  errors?: {
    title_ku?: string[];
    title_en?: string[];
    title_ar?: string[];
    image_url?: string[];
  };
  message?: string | null;
};

export async function createQuote(prevState: QuoteState, formData: FormData) {
  const validatedFields = CreateQuote.safeParse({
    title_ku: formData.get("title_ku"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    image_url: formData.get("image_url"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Quote.",
    };
  }

  const { title_ku, title_en, title_ar, image_url } = validatedFields.data;
  console.log(image_url);
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Check if quote with this name already exists
    const [existingQuote] = (await connection.execute(
      "SELECT id FROM quotes WHERE title_ku = ? OR title_en = ? OR title_ar = ?",
      [title_ku, title_en, title_ar]
    )) as any[];

    if (existingQuote.length > 0) {
      return {
        errors: {
          title_en: ["Quote with this name already exists"],
        },
        message: "Quote name must be unique.",
      };
    }

    // Insert quote record
    await connection.execute(
      "INSERT INTO quotes (title_ku, title_en, title_ar,image_url) VALUES (?, ?, ?,?)",
      [title_ku, title_en, title_ar, image_url]
    );

    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Create Quote.", error);
    return {
      errors: {},
      message: "Database Error: Failed to create quote.",
    };
  }
  revalidatePath("/dashboard/quote");
  redirect("/dashboard/quote");
}

export async function deleteQuote(id: string) {
  try {
    const connection = await getConnection();
    await connection.beginTransaction();

    console.log("Deleting quote for ID:", id);

    // Delete the quote record
    await connection.execute("DELETE FROM quotes WHERE id = ?", [id]);

    await connection.commit();
    console.log("Quote deleted successfully");
  } catch (error) {
    console.error("Database Error: Failed to Delete Quote.", error);
    throw new Error("Failed to delete quote");
  }
  revalidatePath("/dashboard/quote");
}

export async function updateQuote(id: string, formData: FormData) {
  const validatedFields = CreateQuote.safeParse({
    title_ku: formData.get("title_ku"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    image_url: formData.get("image_url"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Quote.",
    };
  }

  const { title_ku, title_en, title_ar, image_url } = validatedFields.data;

  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Check if another quote has the same name (excluding current one)
    const [existingQuote] = (await connection.execute(
      "SELECT id FROM quotes WHERE (title_ku = ? OR title_en = ? OR title_ar = ?) AND id != ?",
      [title_ku, title_en, title_ar, id]
    )) as any[];

    if (existingQuote.length > 0) {
      return {
        errors: {
          title_en: ["Quote with this name already exists"],
        },
        message: "Quote name must be unique.",
      };
    }

    // Update quote record
    await connection.execute(
      "UPDATE quotes SET title_ku = ?, title_en = ?, title_ar = ?, image_url = ? WHERE id = ?",
      [title_ku, title_en, title_ar, image_url, id]
    );
    console.log("Quote updated successfully");
    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Update Quote.", error);
    throw new Error("Failed to update quote");
  }
  revalidatePath("/dashboard/quote");
  redirect("/dashboard/quote");
}

const CreateSocialMedia = z.object({
  type: z.nativeEnum(SocialMediaType),
  url: z.string().min(1, "URL is required"),
});

export type SocialMediaState = {
  errors?: {
    type?: string[];
    url?: string[];
  };
  message?: string | null;
};

export async function createSocialMedia(
  prevState: SocialMediaState,
  formData: FormData
) {
  const validatedFields = CreateSocialMedia.safeParse({
    type: parseInt(formData.get("type") as string),
    url: formData.get("url"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Social Media.",
    };
  }

  const { type, url } = validatedFields.data;

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Check if social media with this URL already exists
    const [existingSocialMedia] = (await connection.execute(
      "SELECT id FROM social_media WHERE url = ?",
      [url]
    )) as any[];

    if (existingSocialMedia.length > 0) {
      return {
        errors: {
          url: ["Social media with this URL already exists"],
        },
        message: "Social media URL must be unique.",
      };
    }

    // Insert social media record
    await connection.execute(
      "INSERT INTO social_media (type, url) VALUES (?, ?)",
      [type, url]
    );

    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Create Social Media.", error);
    return {
      errors: {},
      message: "Database Error: Failed to create social media.",
    };
  }
  revalidatePath("/dashboard/social-media");
  redirect("/dashboard/social-media");
}

export async function deleteSocialMedia(id: string) {
  try {
    const connection = await getConnection();
    await connection.beginTransaction();

    // Delete the social media record
    await connection.execute("DELETE FROM social_media WHERE id = ?", [id]);

    await connection.commit();
    console.log("Social media deleted successfully");
  } catch (error) {
    console.error("Database Error: Failed to Delete Social Media.", error);
    throw new Error("Failed to delete social media");
  }
  revalidatePath("/dashboard/social-media");
  redirect("/dashboard/social-media");
}

export async function updateSocialMedia(id: string, formData: FormData) {
  console.log("updateSocialMedia called with id:", id);
  console.log("FormData contents:", {
    type: formData.get("type"),
    url: formData.get("url"),
  });

  const validatedFields = CreateSocialMedia.safeParse({
    type: parseInt(formData.get("type") as string),
    url: formData.get("url"),
  });

  if (!validatedFields.success) {
    console.log("Validation failed:", validatedFields.error);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Social Media.",
    };
  }

  const { type, url } = validatedFields.data;
  console.log("Validated data:", { type, url });

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Check if another social media has the same URL (excluding current one)
    const [existingSocialMedia] = (await connection.execute(
      "SELECT id FROM social_media WHERE url = ? AND id != ?",
      [url, id]
    )) as any[];

    if (existingSocialMedia.length > 0) {
      console.log("URL already exists:", url);
      return {
        errors: {
          url: ["Social media with this URL already exists"],
        },
        message: "Social media URL must be unique.",
      };
    }

    // Update social media record
    console.log("Updating social media with:", { type, url, id });
    await connection.execute(
      "UPDATE social_media SET type = ?, url = ? WHERE id = ?",
      [type, url, id]
    );

    await connection.commit();
    console.log("Social media updated successfully");
  } catch (error) {
    console.error("Database Error: Failed to Update Social Media.", error);
    throw new Error("Failed to update social media");
  }
  revalidatePath("/dashboard/social-media");
  redirect("/dashboard/social-media");
}

export async function UpdateQuoteState(
  prevState: QuoteState,
  formData: FormData
) {
  const validatedFields = CreateQuote.safeParse({
    title_ku: formData.get("title_ku"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    description_ku: formData.get("description_ku"),
    description_en: formData.get("description_en"),
    description_ar: formData.get("description_ar"),
  });
}

const CreateProperty = z.object({
  key: z.string().min(1, "Key is required"),
  value_ku: z.string().min(1, "Value is required"),
  value_en: z.string().min(1, "Value is required"),
  value_ar: z.string().min(1, "Value is required"),
});

export type PropertyState = {
  errors?: {
    key?: string[];
    value_ku?: string[];
    value_en?: string[];
    value_ar?: string[];
  };
  message?: string | null;
};

export async function createProperty(formData: FormData) {
  const validatedFields = CreateProperty.safeParse({
    key: formData.get("key"),
    value_ku: formData.get("value_ku"),
    value_en: formData.get("value_en"),
    value_ar: formData.get("value_ar"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Property.",
    };
  }

  const { key, value_ku, value_en, value_ar } = validatedFields.data;

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Check if property with this key already exists
    const [existingProperty] = (await connection.execute(
      "SELECT id FROM properties WHERE `key` = ?",
      [key]
    )) as any[];

    if (existingProperty.length > 0) {
      return {
        errors: {
          key: ["Property with this key already exists"],
        },
        message: "Property key must be unique.",
      };
    }

    // Insert property record
    await connection.execute(
      "INSERT INTO properties (`key`, value_ku, value_en, value_ar) VALUES (?, ?, ?, ?)",
      [key, value_ku, value_en, value_ar]
    );

    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Create Property.", error);
    return {
      errors: {},
      message: "Database Error: Failed to create property.",
    };
  }
  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

export async function updateProperty(id: string, formData: FormData) {
  const validatedFields = CreateProperty.safeParse({
    key: formData.get("key"),
    value_ku: formData.get("value_ku"),
    value_en: formData.get("value_en"),
    value_ar: formData.get("value_ar"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Property.",
    };
  }

  const { key, value_ku, value_en, value_ar } = validatedFields.data;

  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Check if another property has the same key (excluding current one)
    const [existingProperty] = (await connection.execute(
      "SELECT id FROM properties WHERE `key` = ? AND id != ?",
      [key, id]
    )) as any[];

    if (existingProperty.length > 0) {
      return {
        errors: {
          key: ["Property with this key already exists"],
        },
        message: "Property key must be unique.",
      };
    }

    // Update property record
    await connection.execute(
      "UPDATE properties SET `key` = ?, value_ku = ?, value_en = ?, value_ar = ? WHERE id = ?",
      [key, value_ku, value_en, value_ar, id]
    );

    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Update Property.", error);
    throw new Error("Failed to update property");
  }

  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

export async function deleteProperty(id: string) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Delete the property record
    await connection.execute("DELETE FROM properties WHERE id = ?", [id]);

    await connection.commit();
    console.log("Property deleted successfully");
  } catch (error) {
    console.error("Database Error: Failed to Delete Property.", error);
    return {
      errors: {},
      message: "Database Error: Failed to delete property.",
    };
  }
  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}

// Special Project CRUD Operations
const CreateSpecialProject = z.object({
  image_url: z.string().min(1, "Image URL is required"),
  sort_order: z.coerce.number().min(0, "Sort order must be 0 or greater"),
});

export type SpecialProjectState = {
  errors?: {
    image_url?: string[];
    sort_order?: string[];
  };
  message?: string | null;
};

export async function createSpecialProject(
  prevState: SpecialProjectState,
  formData: FormData
) {
  const validatedFields = CreateSpecialProject.safeParse({
    image_url: formData.get("image_url"),
    sort_order: formData.get("sort_order"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Special Project.",
    };
  }

  const { image_url, sort_order } = validatedFields.data;

  try {
    const connection = await getConnection();
    await connection.execute(
      "INSERT INTO special_projects (image_url, sort_order) VALUES (?, ?)",
      [image_url, sort_order]
    );
    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Create Special Project.", error);

    // Check if it's a duplicate sort_order error
    if (error instanceof Error && error.message.includes("Duplicate entry")) {
      return {
        errors: {
          sort_order: [
            "Sort order already exists. Please choose a different number.",
          ],
        },
        message: "Sort order must be unique.",
      };
    }

    return {
      errors: {},
      message: "Database Error: Failed to create special project.",
    };
  }
  revalidatePath("/dashboard/special-projects");
  redirect("/dashboard/special-projects");
}

export async function updateSpecialProject(id: string, formData: FormData) {
  const validatedFields = CreateSpecialProject.safeParse({
    image_url: formData.get("image_url"),
    sort_order: formData.get("sort_order"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Special Project.",
    };
  }

  const { image_url, sort_order } = validatedFields.data;

  try {
    const connection = await getConnection();
    await connection.execute(
      "UPDATE special_projects SET image_url = ?, sort_order = ? WHERE id = ?",
      [image_url, sort_order, id]
    );
    await connection.commit();
  } catch (error) {
    console.error("Database Error: Failed to Update Special Project.", error);

    // Check if it's a duplicate sort_order error
    if (error instanceof Error && error.message.includes("Duplicate entry")) {
      return {
        errors: {
          sort_order: [
            "Sort order already exists. Please choose a different number.",
          ],
        },
        message: "Sort order must be unique.",
      };
    }

    return {
      errors: {},
      message: "Database Error: Failed to update special project.",
    };
  }
  revalidatePath("/dashboard/special-projects");
  redirect("/dashboard/special-projects");
}

export async function handleSpecialProject(
  prevState: SpecialProjectState,
  formData: FormData
) {
  const mode = formData.get("mode") as "create" | "edit";
  const id = formData.get("id") as string;

  if (mode === "edit" && id) {
    return await updateSpecialProject(id, formData);
  } else {
    return await createSpecialProject(prevState, formData);
  }
}

export async function getNextAvailableSortOrder() {
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      `SELECT MAX(sort_order) as max_sort_order FROM special_projects`
    );

    const maxSortOrder = (rows as { max_sort_order: number }[])[0]
      ?.max_sort_order;
    return (maxSortOrder ?? -1) + 1;
  } catch (error) {
    console.error("Database Error:", error);
    return 0; // Default to 0 if there's an error
  } finally {
    if (connection) await connection.end();
  }
}

export async function deleteSpecialProject(id: string) {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();

    // Get the image URL before deleting to remove from cloud storage
    const [rows] = (await connection.execute(
      "SELECT image_url FROM special_projects WHERE id = ?",
      [id]
    )) as any[];

    if (rows.length > 0 && rows[0].image_url) {
      // Delete the image from cloud storage
      try {
        await deleteCloudFile(rows[0].image_url);
      } catch (cloudError) {
        console.error("Failed to delete image from cloud storage:", cloudError);
        // Continue with database deletion even if cloud storage deletion fails
      }
    }

    // Delete the special project record
    await connection.execute("DELETE FROM special_projects WHERE id = ?", [id]);
    await connection.commit();
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Database Error: Failed to Delete Special Project.", error);
    throw new Error("Failed to delete special project");
  } finally {
    if (connection) await connection.end();
  }
  revalidatePath("/dashboard/special-projects");
  redirect("/dashboard/special-projects");
}

// Sign Out Action
export async function handleSignOut() {
  await signOut({ redirectTo: "/" });
}

// Banner CRUD Operations
const CreateBanner = z
  .object({
    title_ku: z.string().min(1, "Kurdish title is required"),
    title_en: z.string().min(1, "English title is required"),
    title_ar: z.string().min(1, "Arabic title is required"),
    image_url: z.string(),
    video_url: z.string().optional(),
    type: z.enum(["image", "video"]),
    is_active: z.boolean().default(true),
    sort_order: z.number().default(0),
  })
  .refine(
    (data) => {
      // If type is image, image_url must be present
      if (data.type === "image" && !data.image_url) {
        return false;
      }
      // If type is video, video_url must be present
      if (data.type === "video" && !data.video_url) {
        return false;
      }
      return true;
    },
    {
      message:
        "Image is required for image type, video is required for video type",
      path: ["image_url"],
    }
  );

export type BannerState = {
  errors?: {
    title_ku?: string[];
    title_en?: string[];
    title_ar?: string[];
    image_url?: string[];
    video_url?: string[];
    type?: string[];
  };
  message?: string | null;
};

export async function createBanner(prevState: BannerState, formData: FormData) {
  const validatedFields = CreateBanner.safeParse({
    title_ku: formData.get("title_ku"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    image_url: formData.get("image_url"),
    video_url: formData.get("video_url") || "",
    type: formData.get("type"),
    is_active: formData.get("is_active") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Banner.",
    };
  }

  const {
    title_ku,
    title_en,
    title_ar,
    image_url,
    video_url,
    type,
    is_active,
    sort_order,
  } = validatedFields.data;
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Insert banner record
    await connection.execute(
      "INSERT INTO banners (title_ku, title_en, title_ar, image_url, video_url, type, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title_ku,
        title_en,
        title_ar,
        image_url,
        video_url || "",
        type,
        is_active,
        sort_order,
      ]
    );

    await connection.commit();
    console.log("Banner created successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Create Banner.", error);
    throw new Error("Failed to create banner");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/banners");
  redirect("/dashboard/banners");
}

export async function updateBanner(id: string, formData: FormData) {
  const validatedFields = CreateBanner.safeParse({
    title_ku: formData.get("title_ku"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    image_url: formData.get("image_url"),
    video_url: formData.get("video_url") || "",
    type: formData.get("type"),
    is_active: formData.get("is_active") === "true",
    sort_order: parseInt(formData.get("sort_order") as string) || 0,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Banner.",
    };
  }

  const {
    title_ku,
    title_en,
    title_ar,
    image_url,
    video_url,
    type,
    is_active,
    sort_order,
  } = validatedFields.data;
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Update banner record
    await connection.execute(
      "UPDATE banners SET title_ku = ?, title_en = ?, title_ar = ?, image_url = ?, video_url = ?, type = ?, is_active = ?, sort_order = ? WHERE id = ?",
      [
        title_ku,
        title_en,
        title_ar,
        image_url,
        video_url || "",
        type,
        is_active,
        sort_order,
        id,
      ]
    );

    await connection.commit();
    console.log("Banner updated successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Update Banner.", error);
    throw new Error("Failed to update banner");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/banners");
  redirect("/dashboard/banners");
}

export async function deleteBanner(id: string) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Get banner to delete old image/video
    const [bannerRows] = (await connection.execute(
      "SELECT image_url, video_url FROM banners WHERE id = ?",
      [id]
    )) as any[];

    if (bannerRows.length > 0) {
      const banner = bannerRows[0];

      // Delete old image from cloud storage
      if (banner.image_url) {
        await deleteCloudFile(banner.image_url);
      }

      // Delete old video from cloud storage
      if (banner.video_url) {
        await deleteCloudFile(banner.video_url);
      }
    }

    // Delete the banner record
    await connection.execute("DELETE FROM banners WHERE id = ?", [id]);

    await connection.commit();
    console.log("Banner deleted successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Delete Banner.", error);
    throw new Error("Failed to delete banner");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/banners");
}

// Audio CRUD Operations
const CreateAudio = z.object({
  title_ku: z.string().min(1, "Kurdish title is required"),
  title_en: z.string().min(1, "English title is required"),
  title_ar: z.string().min(1, "Arabic title is required"),
  audio_url: z.string().min(1, "Audio file is required"),
  is_active: z.boolean().default(true),
  use_for: z.enum(["landing", "intro", "both"]),
});

export type AudioState = {
  errors?: {
    title_ku?: string[];
    title_en?: string[];
    title_ar?: string[];
    audio_url?: string[];
    use_for?: string[];
  };
  message?: string | null;
};

export async function createAudio(prevState: AudioState, formData: FormData) {
  const validatedFields = CreateAudio.safeParse({
    title_ku: formData.get("title_ku"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    audio_url: formData.get("audio_url"),
    is_active: formData.get("is_active") === "true",
    use_for: formData.get("use_for"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Audio.",
    };
  }

  const { title_ku, title_en, title_ar, audio_url, is_active, use_for } =
    validatedFields.data;
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Insert audio record
    await connection.execute(
      "INSERT INTO audios (title_ku, title_en, title_ar, audio_url, is_active, use_for) VALUES (?, ?, ?, ?, ?, ?)",
      [title_ku, title_en, title_ar, audio_url, is_active, use_for]
    );

    await connection.commit();
    console.log("Audio created successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Create Audio.", error);
    throw new Error("Failed to create audio");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/audios");
  redirect("/dashboard/audios");
}

export async function updateAudio(
  id: string,
  prevState: AudioState,
  formData: FormData
) {
  const validatedFields = CreateAudio.safeParse({
    title_ku: formData.get("title_ku"),
    title_en: formData.get("title_en"),
    title_ar: formData.get("title_ar"),
    audio_url: formData.get("audio_url"),
    is_active: formData.get("is_active") === "true",
    use_for: formData.get("use_for"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Audio.",
    };
  }

  const { title_ku, title_en, title_ar, audio_url, is_active, use_for } =
    validatedFields.data;
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    // Update audio record
    await connection.execute(
      "UPDATE audios SET title_ku = ?, title_en = ?, title_ar = ?, audio_url = ?, is_active = ?, use_for = ? WHERE id = ?",
      [title_ku, title_en, title_ar, audio_url, is_active, use_for, id]
    );

    await connection.commit();
    console.log("Audio updated successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Update Audio.", error);
    throw new Error("Failed to update audio");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/audios");
  redirect("/dashboard/audios");
}

export async function deleteAudio(id: string) {
  const connection = await getConnection();
  try {
    await connection.beginTransaction();

    // Get audio to delete old file
    const [audioRows] = (await connection.execute(
      "SELECT audio_url FROM audios WHERE id = ?",
      [id]
    )) as any[];

    if (audioRows.length > 0) {
      const audio = audioRows[0];

      // Delete old audio from cloud storage
      if (audio.audio_url) {
        await deleteCloudFile(audio.audio_url);
      }
    }

    // Delete the audio record
    await connection.execute("DELETE FROM audios WHERE id = ?", [id]);

    await connection.commit();
    console.log("Audio deleted successfully");
  } catch (error) {
    await connection.rollback();
    console.error("Database Error: Failed to Delete Audio.", error);
    throw new Error("Failed to delete audio");
  } finally {
    await connection.end();
  }
  revalidatePath("/dashboard/audios");
}
