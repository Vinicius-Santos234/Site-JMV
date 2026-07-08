import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "Pergunta frequente (FAQ)",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Pergunta",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Resposta",
      type: "text",
      rows: 4,
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
  preview: { select: { title: "question" } },
});
