import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configurações do site",
  type: "document",
  fields: [
    defineField({
      name: "cnpj",
      title: "CNPJ",
      type: "string",
      description: "Exibido no rodapé. Ex.: 15.568.755/0001-64",
    }),
    defineField({
      name: "ctaHighlights",
      title: "Destaques da chamada final (CTA)",
      type: "array",
      of: [{ type: "string" }],
      description:
        'Lista de bullets exibida na seção "Pronto para o próximo projeto?".',
    }),
  ],
  preview: {
    prepare: () => ({ title: "Configurações do site" }),
  },
});
