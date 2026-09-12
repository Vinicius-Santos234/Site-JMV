import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "b54yjbjl",
    dataset: "production",
  },
  // Sem estes dois o `sanity deploy` para num prompt perguntando o hostname e
  // o id da aplicação, o que trava qualquer deploy não-interativo (CI, agente).
  // Ambos já existem — é a Studio em https://jmv.sanity.studio/.
  studioHost: "jmv",
  deployment: {
    appId: "ccg6ainzfu8lb8jsd5ljqmrc",
  },
});
