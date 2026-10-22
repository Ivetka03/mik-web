import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Collection } from "./collections";
import { siteContentDefaults, type SiteContent } from "./site";

type SiteContentContextValue = {
  content: SiteContent;
  collections: Collection[];
  ready: boolean;
};

const SiteContentContext = createContext<SiteContentContextValue>({
  content: siteContentDefaults,
  collections: siteContentDefaults.collections,
  ready: false,
});

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(siteContentDefaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/content")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload) => {
        if (cancelled || !payload) return;
        setContent({ ...siteContentDefaults, ...payload, collections: payload.collections || siteContentDefaults.collections });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      content,
      collections: content.collections,
      ready,
    }),
    [content, ready],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
