import defaultContent from "../../data/site-content.default.json";
import type { Collection } from "./collections";

export type SiteContent = {
  hero: { welcomeLeft: string; welcomeRight: string; mottoLead: string; mottoAccent: string };
  nav: { cta: string };
  featured: { label: string; otherLabel: string; allCollections: string };
  about: { label: string; title: string; paragraphs: string[]; quote: string };
  help: {
    label: string;
    title: string;
    paragraphs: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    photoAlt: string;
  };
  contact: {
    label: string;
    title: string;
    intro: string;
    person: string;
    email: string;
    phone: string;
  };
  footer: {
    tagline: string;
    operatorTitle: string;
    operatorName: string;
    operatorBrand: string;
    legalNote: string;
    copyright: string;
  };
  collections: Collection[];
};

function withAssetBase<T>(value: T): T {
  const prefix = import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
  const rewrite = (input: unknown): unknown => {
    if (typeof input === "string" && input.startsWith("/assets/")) return `${prefix}${input}`;
    if (Array.isArray(input)) return input.map(rewrite);
    if (input && typeof input === "object") {
      return Object.fromEntries(Object.entries(input as Record<string, unknown>).map(([key, nested]) => [key, rewrite(nested)]));
    }
    return input;
  };
  return rewrite(value) as T;
}

export const siteContentDefaults = withAssetBase(defaultContent as SiteContent);

export { withAssetBase };

export function publishedCollections(content: SiteContent): Collection[] {
  return content.collections.filter((item) => item.published);
}
