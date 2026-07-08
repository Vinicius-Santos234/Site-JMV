import { defineField, defineType } from "sanity";

export const client = defineType({
  name: "client",
  title: "Cliente",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nome",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description: "Preferência por PNG/WEBP com fundo transparente.",
      options: { hotspot: false },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Ordem",
      type: "number",
      initialValue: 100,
    }),
  ],
  orderings: [
    {
      title: "Ordem manual",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "name", media: "logo" } },
});
