import { defineField, defineType } from "sanity";

const ICONS = [
  "Factory",
  "Building2",
  "Wrench",
  "Cog",
  "HardHat",
  "ShieldCheck",
];

export const service = defineType({
  name: "service",
  title: "Serviço",
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
      description: "Menor aparece primeiro.",
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
