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
      name: "norms",
      title: "Normas e especificações",
      type: "array",
      of: [{ type: "string" }],
      description:
        "Chips exibidos na base do card (ex.: ASME B31.3, NR-13, Solda TIG/ER). " +
        "Máximo de 3, até 26 caracteres cada — acima disso o card perde o " +
        "alinhamento com os vizinhos.",
      // A validação aqui é o único lugar que avisa QUEM ESTÁ ESCREVENDO. O site
      // se defende sozinho (descarta valor inválido, corta texto longo com
      // reticências), mas defesa silenciosa deixa o erro no ar: o chip some ou
      // aparece cortado e ninguém liga à edição que causou. Errar no Studio,
      // com a mensagem ao lado do campo, é onde dá para corrigir.
      validation: (rule) =>
        rule
          .max(3)
          .unique()
          .custom((norms) => {
            if (!Array.isArray(norms)) return true;

            const vazio = norms.findIndex(
              (n) => typeof n !== "string" || n.trim() === ""
            );
            if (vazio !== -1) {
              return `O item ${vazio + 1} está vazio. Remova-o ou escreva a norma.`;
            }

            const longo = norms.find((n) => n.trim().length > 26);
            if (longo) {
              return `"${longo}" tem ${longo.trim().length} caracteres. O limite é 26 — ` +
                `acima disso o chip é cortado com reticências no site.`;
            }

            return true;
          }),
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
