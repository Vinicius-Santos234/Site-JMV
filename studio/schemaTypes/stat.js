import { defineField, defineType } from "sanity";

export const stat = defineType({
  name: "stat",
  title: "Estatística",
  type: "document",
  fields: [
    defineField({
      name: "number",
      title: "Número",
      type: "string",
      description: 'Valor exibido, ex.: "13+", "100+", "5+".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      title: "Rótulo",
      type: "string",
      description: 'Ex.: "Anos", "Projetos", "Clientes".',
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
  preview: { select: { title: "number", subtitle: "label" } },
});
