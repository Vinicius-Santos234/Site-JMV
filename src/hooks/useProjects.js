import { useState, useEffect } from "react";
import { sanityClient, isSanityConfigured, urlFor } from "../lib/sanity";
import { ALL_PROJECTS } from "../data/portfolio-full";

const PLACEHOLDERS = ALL_PROJECTS.filter((p) => p.placeholder);

const LOCAL_REAL = ALL_PROJECTS.filter((p) => !p.placeholder);

const QUERY = `*[_type == "project"] | order(order asc, year desc) {
  _id, title, client, year, category, image
}`;

function mapFromSanity(doc) {
  return {
    id: doc._id,
    title: doc.title,
    client: doc.client,
    year: doc.year,
    category: doc.category,
    image: doc.image ? urlFor(doc.image).width(1200).auto("format").url() : "",
    placeholder: false,
  };
}

export function useProjects() {
  const [real, setReal] = useState(isSanityConfigured ? [] : LOCAL_REAL);
  const [loading, setLoading] = useState(isSanityConfigured);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSanityConfigured) return;

    let active = true;

    sanityClient
      .fetch(QUERY)
      .then((docs) => {
        if (!active) return;
        setReal(docs.map(mapFromSanity));
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setReal(LOCAL_REAL);
        setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { projects: [...real, ...PLACEHOLDERS], loading, error };
}
