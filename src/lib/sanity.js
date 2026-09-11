import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

// Sem prefixo NEXT_PUBLIC_: todo acesso ao Sanity agora acontece no servidor.
// O projectId não é segredo, mas não há motivo para ir ao bundle.
const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || "production";

export const isSanityConfigured = Boolean(projectId);

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion: "2024-01-01",
      useCdn: true,
    })
  : null;

const builder = sanityClient ? createImageUrlBuilder(sanityClient) : null;

export function urlFor(source) {
  if (!builder || !source) return "";
  return builder.image(source);
}
