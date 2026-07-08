import { defineField, defineType } from "sanity";

const ICONS = ["ShieldCheck", "Award", "Leaf"];

export const qualityItem = defineType({
  name: "qualityItem",
  title: "Item de qualidade",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Descrição",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "iconName",
      title: "Ícone",
      type: "string",
      options: {
        list: ICONS.map((i) => ({ title: i, value: i })),
        layout: "dropdown",
      },
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
  preview: { select: { title: "title", subtitle: "iconName" } },
});
