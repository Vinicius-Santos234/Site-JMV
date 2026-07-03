import { defineField, defineType } from "sanity";

const CATEGORIES = [
  "Montagem Industrial",
  "Estruturas Metálicas",
  "Tubulações Industriais",
  "Caldeiraria",
  "Manutenção Industrial",
];

export const project = defineType({
  name: "project",
  title: "Projeto (Portfólio)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título do projeto",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "Cliente",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Ano",
      type: "string",
      description: "Ano de execução (ex.: 2024)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "string",
      options: {
        list: CATEGORIES.map((c) => ({ title: c, value: c })),
        layout: "dropdown",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Imagem",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Ordem",
      type: "number",
      description:
        "Menor aparece primeiro. Use para controlar a ordem no portfólio.",
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
  preview: {
    select: { title: "title", subtitle: "client", media: "image" },
  },
});
