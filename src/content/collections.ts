/**
 * Editorial content for collections and models.
 * Replace `collections` (or `getCollections`) with a CMS/API later —
 * page components only read this shape, they do not hardcode item counts.
 */

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

const assets = "/assets";

export const collections: Collection[] = [
  {
    id: "odhalme-se-do-krasy",
    slug: "odhalme-se-do-krasy",
    name: "Odhalme se do krásy",
    intro: "Do slunce. Do barev. Do rozkvetlé přírody. Léto si žádá lehkost, ženskost a trochu odvahy.",
    coverImage: `${assets}/kolekce-bile-more-aligned.jpg`,
    published: true,
    models: [
      {
        id: "bila-krajka",
        slug: "bila-krajka",
        name: "Bílá krajka",
        description: "Lehká krajka u moře. Ženskost, která se nebojí slunce.",
        coverImage: `${assets}/kolekce-bile-more-aligned.jpg`,
        images: [
          `${assets}/kolekce-bile-more-aligned.jpg`,
          `${assets}/kolekce-bila-krajka-2.jpg`,
          `${assets}/kolekce-bila-krajka-3.jpg`,
        ],
      },
      {
        id: "kvetinovy-komplet",
        slug: "kvetinovy-komplet",
        name: "Květinový komplet",
        description: "Barvy tropů a volný pohyb. Model, ve kterém je léto cítit na kůži.",
        coverImage: `${assets}/Ruzovy_overal_1.jpg`,
        images: [
          `${assets}/Ruzovy_overal_1.jpg`,
          `${assets}/Ruzovy_overal_2b.png`,
          `${assets}/Ruzovy_overal_3b.png`,
          `${assets}/Ruzovy_overal_4.jpg`,
        ],
      },
      {
        id: "zluty-overal",
        slug: "zluty-overal",
        name: "Žlutý overal",
        description: "Slunce v jednom kusu. Odvaha, která se usmívá.",
        coverImage: `${assets}/kolekce-zluty-overal-aligned.jpg`,
        images: [
          `${assets}/kolekce-zluty-overal-aligned.jpg`,
          `${assets}/kolekce-zluty-overal-2.jpg`,
          `${assets}/kolekce-zluty-overal-3.jpg`,
        ],
      },
    ],
  },
  {
    id: "nespoutana-duse",
    slug: "nespoutana-duse",
    name: "Nespoutaná duše",
    intro: "Podzim / Zima 2023. Fotografie této kolekce připravujeme.",
    coverImage: "",
    published: false,
    models: [
      {
        id: "nespoutana-duse-1",
        slug: "model-1",
        name: "Model I",
        description: "",
        coverImage: "",
        images: [],
      },
      {
        id: "nespoutana-duse-2",
        slug: "model-2",
        name: "Model II",
        description: "",
        coverImage: "",
        images: [],
      },
      {
        id: "nespoutana-duse-3",
        slug: "model-3",
        name: "Model III",
        description: "",
        coverImage: "",
        images: [],
      },
    ],
  },
];

export function getCollections(): Collection[] {
  return collections;
}

export function getPublishedCollections(): Collection[] {
  return collections.filter((item) => item.published);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return getCollections().find((item) => item.slug === slug);
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
