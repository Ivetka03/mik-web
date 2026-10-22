import defaultContent from "../../data/site-content.default.json";
import type { Collection } from "./collections";

export type SiteContent = {
  hero: { welcomeLeft: string; welcomeRight: string };
  nav: { cta: string };
  featured: { label: string; allCollections: string };
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

export const siteContentDefaults = defaultContent as SiteContent;

export function publishedCollections(content: SiteContent): Collection[] {
  return content.collections.filter((item) => item.published);
}
