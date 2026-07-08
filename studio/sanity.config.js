import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./schemaTypes";

const SINGLETONS = [{ id: "siteSettings", title: "Configurações do site" }];
const SINGLETON_IDS = SINGLETONS.map((s) => s.id);

const structure = (S) =>
  S.list()
    .title("Conteúdo")
    .items([
      ...SINGLETONS.map(({ id, title }) =>
        S.listItem()
          .title(title)
          .id(id)
          .child(S.document().schemaType(id).documentId(id))
      ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETON_IDS.includes(item.getId())
      ),
    ]);

export default defineConfig({
  name: "jmv",
  title: "JMV — Conteúdo do site",

  projectId: "b54yjbjl",
  dataset: "production",

  plugins: [structureTool({ structure })],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_IDS.includes(schemaType)
        ? prev.filter(
            ({ action }) =>
              !["unpublish", "delete", "duplicate"].includes(action)
          )
        : prev,
  },
});
