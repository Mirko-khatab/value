"use client";
import { useState, useEffect, useCallback, ReactNode } from "react";
import Link from "next/link";
import { Button } from "@/app/ui/button";

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "number"
  | "select"
  | "checkbox"
  | "file"
  | "custom";

export interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string }[]; // For select fields
  rows?: number; // For textarea
  customRender?: (
    value: any,
    onChange: (value: any) => void,
    error?: string
  ) => ReactNode; // For custom fields
  gridCol?: "full" | "half"; // Layout: full width or half width
  helpText?: string;
  validation?: (value: any) => string | undefined; // Custom validation
}

interface DashboardFormProps<T> {
  fields: FormField[];
  mode: "create" | "edit";
  initialData?: Partial<T>;
  onSubmit: (formData: FormData, data: Record<string, any>) => Promise<void>;
  cancelPath: string;
  entityName: string; // e.g., "Product", "Project", "Property"
  customContent?: ReactNode; // For complex custom sections like gallery upload
  beforeSubmit?: (data: Record<string, any>) => Record<string, any>; // Transform data before submit
}

export default function DashboardForm<T>({
  fields,
  mode,
  initialData = {},
  onSubmit,
  cancelPath,
  entityName,
  customContent,
  beforeSubmit,
}: DashboardFormProps<T>) {
  const isEditMode = mode === "edit";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Initialize form data from fields
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const data: Record<string, any> = {};
    fields.forEach((field) => {
      data[field.name] =
        initialData[field.name as keyof T] ?? field.defaultValue ?? "";
    });
    return data;
  });

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (isEditMode && initialData) {
      const data: Record<string, any> = {};
      fields.forEach((field) => {
        data[field.name] =
          initialData[field.name as keyof T] ?? field.defaultValue ?? "";
      });
      setFormData(data);
    }
  }, [isEditMode, initialData, fields]);

  const handleInputChange = useCallback(
    (fieldName: string, value: any) => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
      // Clear field error when user starts typing
      if (fieldErrors[fieldName]) {
        setFieldErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      }
    },
    [fieldErrors]
  );

  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {};
    fields.forEach((field) => {
      const value = formData[field.name];

      // Required field validation
      if (field.required && !value && value !== 0) {
        errors[field.name] = `${field.label} is required`;
      }

      // Custom validation
      if (field.validation && value) {
        const validationError = field.validation(value);
        if (validationError) {
          errors[field.name] = validationError;
        }
      }
    });
    return errors;
  }, [fields, formData]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (isSubmitting) {
        return;
      }

      // Validate form
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError("Please fix the errors in the form");
        return;
      }

      setIsSubmitting(true);
      setSuccess(false);
      setError(null);
      setFieldErrors({});

      try {
        // Use the native FormData from the form element
        const nativeFormData = new FormData(e.currentTarget);

        // Transform data if needed
        const dataToSubmit = beforeSubmit ? beforeSubmit(formData) : formData;

        // Add/override with state data (for fields managed by React state)
        // Skip file inputs as they're already in nativeFormData
        Object.keys(dataToSubmit).forEach((key) => {
          const value = dataToSubmit[key];
          const field = fields.find((f) => f.name === key);

          // Don't override file inputs - they're handled by the form itself
          if (field?.type === "file") {
            return;
          }

          if (value !== null && value !== undefined) {
            // Remove existing value if any
            nativeFormData.delete(key);
            // Add the new value
            nativeFormData.append(key, value.toString());
          }
        });

        // Call the provided onSubmit handler
        await onSubmit(nativeFormData, dataToSubmit);

        // If we reach here, the operation was successful
        setSuccess(true);

        // Redirect after a short delay to show success message
        setTimeout(() => {
          window.location.href = cancelPath;
        }, 1000);
      } catch (err) {
        console.error(`Failed to ${mode} ${entityName}:`, err);
        setError(
          err instanceof Error
            ? err.message
            : `Failed to ${mode} ${entityName}. Please try again.`
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      isSubmitting,
      validateForm,
      beforeSubmit,
      formData,
      onSubmit,
      mode,
      entityName,
      cancelPath,
    ]
  );

  const renderField = (field: FormField) => {
    const value = formData[field.name];
    const hasError = fieldErrors[field.name];

    if (field.customRender) {
      return field.customRender(
        value,
        (newValue) => handleInputChange(field.name, newValue),
        hasError
      );
    }

    const baseInputClass = `w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white ${
      hasError
        ? "border-red-500 dark:border-red-500"
        : "border-gray-300 dark:border-gray-600"
    }`;

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.name}
            name={field.name}
            required={field.required}
            value={value || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className={baseInputClass}
          />
        );

      case "select":
        return (
          <select
            id={field.name}
            name={field.name}
            required={field.required}
            value={value || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={baseInputClass}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "checkbox":
        return (
          <input
            type="checkbox"
            id={field.name}
            name={field.name}
            checked={value || false}
            onChange={(e) => handleInputChange(field.name, e.target.checked)}
            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
        );

      case "file":
        return (
          <div className="space-y-2">
            <input
              type="file"
              id={field.name}
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    setError(null);
                    // Upload file to cloud storage
                    const { uploadToCloud } = await import(
                      "@/app/lib/cloud-upload-client"
                    );
                    const result = await uploadToCloud(file);
                    // Update form data with the public URL
                    handleInputChange(field.name, result.publicUrl);
                  } catch (error) {
                    console.error("File upload error:", error);
                    setError("Failed to upload image. Please try again.");
                  }
                }
              }}
              className={baseInputClass}
            />
            {/* Hidden input to store the uploaded URL */}
            <input type="hidden" name={field.name} value={value || ""} />
            {value && (
              <div className="text-sm text-green-600 dark:text-green-400">
                ✓ Image uploaded successfully
              </div>
            )}
          </div>
        );

      case "date":
      case "number":
      case "text":
      default:
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            required={field.required}
            value={value || ""}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 dark:bg-gray-800 p-4 md:p-6 transition-colors duration-200">
        {/* Success Message */}
        {success && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-100 border border-green-400 rounded dark:bg-green-900 dark:text-green-200 dark:border-green-700">
            {entityName} {isEditMode ? "updated" : "created"} successfully!
            Redirecting...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded dark:bg-red-900 dark:text-red-200 dark:border-red-700">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4 mb-4">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`mb-4 ${
                field.gridCol === "full" ? "md:col-span-2" : ""
              }`}
            >
              <label
                htmlFor={field.name}
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
              >
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              {renderField(field)}
              {fieldErrors[field.name] && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  {fieldErrors[field.name]}
                </p>
              )}
              {field.helpText && !fieldErrors[field.name] && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {field.helpText}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Custom Content (e.g., Gallery Upload) */}
        {customContent && <div className="mb-4">{customContent}</div>}

        {/* Required fields note */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          <span className="text-red-500">*</span> Required fields
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={cancelPath}
          className="flex h-10 items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-4 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Cancel
        </Link>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
            ? `Update ${entityName}`
            : `Create ${entityName}`}
        </Button>
      </div>
    </form>
  );
}
