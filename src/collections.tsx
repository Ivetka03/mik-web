import { useEffect, useRef, useState } from "react";
import {
  getModelGallery,
  getPublishedCollections,
  getSiblingModel,
  type Collection,
  type FashionModel,
} from "./content/collections";

function setCollectionHash(collectionSlug: string, modelSlug?: string) {
  const hash = modelSlug ? `#kolekce/${collectionSlug}/${modelSlug}` : `#kolekce/${collectionSlug}`;
  if (window.location.hash !== hash) {
    window.location.hash = hash;
  }
}

export function CollectionsIndex() {
  const collections = getPublishedCollections();

  return (
    <main className="min-h-[calc(100dvh-76px)] sm:min-h-[calc(100dvh-84px)] bg-black">
      <div className="px-5 sm:px-10 lg:px-20 py-16 lg:py-24">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-24 lg:gap-32">
          {collections.map((collection, collectionIndex) => (
            <article id={`kolekce-${collection.slug}`} key={collection.id} className="flex flex-col gap-10 lg:gap-16">
              <div className="flex flex-col gap-4 max-w-[700px]">
                <div className="flex items-center gap-3 text-[#f50067]">
                  <span aria-hidden className="h-px w-8 shrink-0 bg-current" />
                  <p className="font-['Manrope:Bold'] font-bold text-[12px] sm:text-[13px] tracking-[1.5px] sm:tracking-[2px] uppercase">
                    {collectionIndex === 0 ? "Aktuální kolekce" : "Kolekce"}
                  </p>
                </div>
                <h1 className="font-['Cormorant_Garamond:Regular'] font-normal leading-[1.15] text-[#e6d4ae] text-[32px] sm:text-5xl lg:text-[64px] break-words">
                  {collection.name}
                </h1>
                {collection.intro ? (
                  <p className="font-['Manrope:Regular'] font-normal leading-[1.6] text-[#e6d4ae] text-[15px] sm:text-[18px] opacity-80">
                    {collection.intro}
                  </p>
                ) : null}
              </div>
              <div className="mx-auto grid w-full max-w-[1040px] grid-cols-3 gap-2 sm:gap-6 md:gap-8">
                {collection.models.map((model) => (
                  <a
                    key={model.id}
                    href={`#kolekce/${collection.slug}/${model.slug}`}
                    className="group relative aspect-[9/16] overflow-hidden border border-[#c3a06b] bg-black"
                  >
                    <img
                      alt={model.name}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                      src={model.coverImage}
                    />
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export function CollectionPage({
  collection,
  modelSlug,
}: {
  collection: Collection;
  modelSlug: string | null;
}) {
  const activeModel = modelSlug ? collection.models.find((item) => item.slug === modelSlug) : undefined;

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-black">
      <div className="min-h-full px-5 sm:px-10 lg:px-20 py-10 lg:py-16">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-12 lg:gap-16">
          <div className="flex flex-col gap-6">
            <a
              href="#kolekce"
              className="self-start font-['Manrope:SemiBold'] font-semibold text-[#c3a06b] text-[12px] tracking-[1.5px] uppercase hover:text-[#e6d4ae] transition-colors"
            >
              ← Zpět na kolekce
            </a>
            <div className="flex flex-col gap-4 max-w-[760px]">
              <div className="flex items-center gap-3 text-[#f50067]">
                <span aria-hidden className="h-px w-8 shrink-0 bg-current" />
                <p className="font-['Manrope:Bold'] font-bold text-[12px] sm:text-[13px] tracking-[1.5px] sm:tracking-[2px] uppercase">
                  Kolekce
                </p>
              </div>
              <h1 className="font-['Cormorant_Garamond:Regular'] font-normal leading-[1.1] text-[#e6d4ae] text-4xl lg:text-[64px]">
                {collection.name}
              </h1>
              {collection.intro ? (
                <p className="font-['Manrope:Regular'] font-normal leading-[1.7] text-[#e6d4ae] text-[16px] sm:text-[18px] opacity-80">
                  {collection.intro}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-10 lg:gap-14">
            {collection.models.map((model) => (
              <button
                key={model.id}
                type="button"
                onClick={() => setCollectionHash(collection.slug, model.slug)}
                className="group relative w-full text-left"
              >
                <div className="relative overflow-hidden border border-[#c3a06b] bg-black">
                  <img
                    alt={model.name}
                    src={model.coverImage}
                    className="block w-full max-h-[82vh] object-contain mx-auto transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent px-5 sm:px-8 py-6 sm:py-8">
                    <p className="font-['Cormorant_Garamond:Regular'] text-[#e6d4ae] text-2xl sm:text-4xl">
                      {model.name}
                    </p>
                    {model.description ? (
                      <p className="mt-2 max-w-[520px] font-['Manrope:Regular'] text-[#e6d4ae] text-[14px] sm:text-[15px] leading-relaxed opacity-80">
                        {model.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeModel ? (
        <ModelGallery
          collection={collection}
          model={activeModel}
          onClose={() => setCollectionHash(collection.slug)}
        />
      ) : null}
    </div>
  );
}

export function ModelGallery({
  collection,
  model,
  onClose,
}: {
  collection: Collection;
  model: FashionModel;
  onClose: () => void;
}) {
  const photos = getModelGallery(model);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const photosLength = photos.length;
  const lightboxSrc = lightboxIndex != null ? photos[lightboxIndex] : null;

  useEffect(() => {
    setLightboxIndex(null);
  }, [model.id]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  function stepLightbox(delta: number) {
    if (photosLength === 0) return;
    setLightboxIndex((current) => {
      if (current == null) return current;
      return (current + delta + photosLength) % photosLength;
    });
  }

  function goToSibling(direction: -1 | 1) {
    const sibling = getSiblingModel(collection, model.slug, direction);
    if (sibling) setCollectionHash(collection.slug, sibling.slug);
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxIndex != null) {
          setLightboxIndex(null);
          return;
        }
        onClose();
        return;
      }
      if (event.key === "ArrowRight") {
        if (lightboxIndex != null) stepLightbox(1);
        else goToSibling(1);
      }
      if (event.key === "ArrowLeft") {
        if (lightboxIndex != null) stepLightbox(-1);
        else goToSibling(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [collection, lightboxIndex, model.slug, onClose, photosLength]);

  return (
    <div className="fixed inset-0 z-[80] bg-black flex flex-col" role="dialog" aria-modal="true" aria-label={model.name}>
      <div className="flex items-center justify-between gap-4 px-5 sm:px-10 py-5 border-b border-[#c3a06b]/40 shrink-0">
        <div className="min-w-0">
          <p className="font-['Manrope:Bold'] font-bold text-[#c3a06b] text-[11px] tracking-[2px] uppercase truncate">
            {collection.name}
          </p>
          <h2 className="font-['Cormorant_Garamond:Regular'] text-[#e6d4ae] text-2xl sm:text-3xl truncate">
            {model.name}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 border border-[#c3a06b] px-4 sm:px-5 py-2.5 font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[11px] sm:text-[12px] tracking-[1.5px] uppercase hover:bg-[#c3a06b] hover:text-[#1b1412] transition-colors"
        >
          Zpět ke kolekci
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-3 sm:px-6 lg:px-10 py-6 lg:py-10">
          <div className="mx-auto flex w-full max-w-[1440px] flex-wrap justify-center gap-1 sm:gap-2">
            {photos.map((src, photoIndex) => (
              <button
                key={`${src}-${photoIndex}`}
                type="button"
                className="group relative aspect-[9/16] w-[calc((100%-0.25rem)/2)] sm:w-[calc((100%-1rem)/3)] lg:w-[calc((100%-1.5rem)/4)] shrink-0 overflow-hidden border border-[#c3a06b] bg-black cursor-pointer"
                onClick={() => setLightboxIndex(photoIndex)}
                aria-label={`Zvětšit fotografii ${photoIndex + 1} z ${photosLength}`}
              >
                {src ? (
                  <img
                    alt={`${model.name} — fotografie ${photoIndex + 1} z ${photosLength}`}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
                    src={src}
                  />
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-10 py-4 border-t border-[#c3a06b]/40 shrink-0">
        <p className="font-['Manrope:Regular'] text-[#e6d4ae] text-[13px] sm:text-[14px] leading-relaxed opacity-80 max-w-[640px]">
          {model.description}
        </p>
        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={() => goToSibling(-1)}
            className="font-['Manrope:SemiBold'] text-[#c3a06b] text-[11px] tracking-[1.5px] uppercase hover:text-[#e6d4ae] transition-colors"
          >
            ← Předchozí model
          </button>
          <span className="font-['Manrope:Regular'] text-[#e6d4ae]/50 text-[12px]">
            {collection.models.findIndex((item) => item.id === model.id) + 1} / {collection.models.length}
          </span>
          <button
            type="button"
            onClick={() => goToSibling(1)}
            className="font-['Manrope:SemiBold'] text-[#c3a06b] text-[11px] tracking-[1.5px] uppercase hover:text-[#e6d4ae] transition-colors"
          >
            Další model →
          </button>
        </div>
      </div>

      {lightboxSrc ? (
        <div
          className="fixed inset-0 z-[90] bg-black flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label={`${model.name} — zvětšená fotografie`}
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(event) => {
            touchStartX.current = event.changedTouches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            const start = touchStartX.current;
            const end = event.changedTouches[0]?.clientX;
            touchStartX.current = null;
            if (start == null || end == null) return;
            const delta = end - start;
            if (delta > 56) stepLightbox(-1);
            if (delta < -56) stepLightbox(1);
          }}
        >
          <div
            className="flex items-center justify-between gap-4 px-5 sm:px-10 py-5 border-b border-[#c3a06b]/40"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="font-['Manrope:Regular'] text-[#e6d4ae] text-[13px] tracking-[1.5px] uppercase">
              {(lightboxIndex ?? 0) + 1} / {photosLength}
            </p>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="shrink-0 border border-[#c3a06b] px-4 sm:px-5 py-2.5 font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[11px] sm:text-[12px] tracking-[1.5px] uppercase hover:bg-[#c3a06b] hover:text-[#1b1412] transition-colors"
            >
              Zavřít
            </button>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center gap-2 sm:gap-4 px-3 sm:px-6 py-6">
            {photosLength > 1 ? (
              <button
                type="button"
                aria-label="Předchozí fotografie"
                onClick={(event) => {
                  event.stopPropagation();
                  stepLightbox(-1);
                }}
                className="shrink-0 flex h-8 w-8 items-center justify-center bg-[#c3a06b] text-[#1b1412] text-lg leading-none hover:bg-[#e6d4ae] transition-colors"
              >
                ‹
              </button>
            ) : null}
            <img
              alt={`${model.name} — fotografie ${(lightboxIndex ?? 0) + 1} z ${photosLength}`}
              className="max-h-full max-w-full object-contain"
              src={lightboxSrc}
              onClick={(event) => event.stopPropagation()}
            />
            {photosLength > 1 ? (
              <button
                type="button"
                aria-label="Další fotografie"
                onClick={(event) => {
                  event.stopPropagation();
                  stepLightbox(1);
                }}
                className="shrink-0 flex h-8 w-8 items-center justify-center bg-[#c3a06b] text-[#1b1412] text-lg leading-none hover:bg-[#e6d4ae] transition-colors"
              >
                ›
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
