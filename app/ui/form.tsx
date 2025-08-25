// components/form/InputField.tsx
"use client";
import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  action: (formData: FormData) => Promise<void>;
  defaultValue?: string;
  fields: {
    name: string;
    label: string;
    type: string;
    options?: string[];
  }[];
  required?: boolean;
  type?: string;
}

export default function InputField({
  label,
  name,
  placeholder,
  defaultValue,
  required = false,
  fields,
  type = "text",
  action,
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <form action={action}>
        {fields.map((field) => (
          <input
            key={field.name}
            type={field.type}
            name={field.name}
            defaultValue={defaultValue}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        ))}
      </form>
    </div>
  );
}
