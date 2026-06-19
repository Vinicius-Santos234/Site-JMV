import { useEffect } from "react";

const BASE_TITLE = "JMV Engenharia e Construções | Montagem Industrial em Matão - SP";
const BASE_DESC =
  `Especialistas em montagem industrial, estruturas metálicas, caldeiraria e tubulações. Mais de ${new Date().getFullYear() - 2013} anos atendendo os setores sucroenergético e petroquímico. Matão - SP.`;

export function useSEO({ title = BASE_TITLE, description = BASE_DESC } = {}) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") ?? "";
    metaDesc?.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      metaDesc?.setAttribute("content", prevDesc);
    };
  }, [title, description]);
}
