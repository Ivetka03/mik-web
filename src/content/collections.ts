/**
 * Editorial content for collections and models.
 * Replace `collections` (or `getCollections`) with a CMS/API later —
 * page components only read this shape, they do not hardcode item counts.
 */

import defaultContent from "../../data/site-content.default.json";

export type ModelDetail = {
  label: string;
  value: string;
};

export type FashionModel = {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  images: string[];
  details?: ModelDetail[];
};

export type Collection = {
  id: string;
  slug: string;
  name: string;
  intro: string;
  coverImage: string;
  /** Set to false to keep a collection in the data file without showing it on the site. */
  published: boolean;
  models: FashionModel[];
};

export const collections: Collection[] = defaultContent.collections as Collection[];

export function getCollections(list: Collection[] = collections): Collection[] {
  return list;
}

export function getPublishedCollections(list: Collection[] = collections): Collection[] {
  return list.filter((item) => item.published);
}

export function getCollectionBySlug(slug: string, list: Collection[] = collections): Collection | undefined {
  return getCollections(list).find((item) => item.slug === slug);
}

export function getModelBySlug(collection: Collection, slug: string): FashionModel | undefined {
  return collection.models.find((item) => item.slug === slug);
}

export function getModelGallery(model: FashionModel): string[] {
  if (model.images.length > 0) return model.images;
  return model.coverImage ? [model.coverImage] : [];
}

export function getSiblingModel(
  collection: Collection,
  slug: string,
  direction: -1 | 1,
): FashionModel | undefined {
  const index = collection.models.findIndex((item) => item.slug === slug);
  if (index < 0 || collection.models.length === 0) return undefined;
  const next = (index + direction + collection.models.length) % collection.models.length;
  return collection.models[next];
}
