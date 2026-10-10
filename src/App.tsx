import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LegalPage, privacyPolicy, termsOfService } from "./legal";
import mikLogoMask from "./assets/mik-logo-mask.png";
import { CollectionsIndex, ModelGallery } from "./collections";
import { getCollectionBySlug, getModelBySlug, getPublishedCollections } from "./content/collections";

const assetPathPrefix = "/assets";
const imgHeaderLogo = `${assetPathPrefix}/727b1.png`;
const imgSectionIntroSplash = `${assetPathPrefix}/uvod-hero-v7.png`;
const imgStorefrontCurtains = `${assetPathPrefix}/vylaha-zavesy-vlevo.jpg`;
const imgRectangle = `${assetPathPrefix}/96521.png`;
const imgRectangle3 = `${assetPathPrefix}/59799.png`;
const imgRectangle4 = `${assetPathPrefix}/dc86d.png`;
const imgRectangle5 = `${assetPathPrefix}/1bc60.png`;
const imgRectangle6 = `${assetPathPrefix}/c7d07.png`;
const imgRectangle7 = `${assetPathPrefix}/a9ef2.png`;
const imgRectangle8 = `${assetPathPrefix}/pomahame-tenis.jpg`;
const imgLensFlareLeft = `${assetPathPrefix}/9f1b0.svg`;
const imgLensFlareRight = `${assetPathPrefix}/d80c9.svg`;
const imgLineAccentTop = `${assetPathPrefix}/a52bb.svg`;
const imgLineAccentBottom = `${assetPathPrefix}/eafdf.svg`;
const imgDots = `${assetPathPrefix}/92ef6.svg`;
const imgMessageCircle = `${assetPathPrefix}/3ee20.svg`;
const imgLine1 = `${assetPathPrefix}/9d992.svg`;

function SectionLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span aria-hidden className="h-px w-8 shrink-0 bg-current" />
      <p className="font-['Manrope:Bold'] font-bold text-[12px] sm:text-[13px] tracking-[1.5px] sm:tracking-[2px] uppercase">
        {children}
      </p>
    </div>
  );
}

const goldSurface = {
  backgroundColor: "rgb(213, 188, 121)",
  backgroundImage:
    "linear-gradient(115deg, rgba(255,247,217,0) 16%, rgba(255,250,229,0.22) 50%, rgba(255,247,217,0) 84%)",
};

function BrandStorySection({
  id,
  minFullPage = false,
}: {
  id?: string;
  minFullPage?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden px-5 sm:px-10 lg:px-20 py-24 lg:py-[140px]${
        minFullPage ? " min-h-[calc(100dvh-76px)] sm:min-h-[calc(100dvh-84px)]" : ""
      }`}
      style={goldSurface}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
        <div className="mx-auto w-full max-w-[440px] lg:mx-0 lg:w-[500px] lg:max-w-none shrink-0 aspect-[580/720] relative">
          <img alt="" className="absolute inset-0 w-full h-full object-cover" src={imgRectangle} />
        </div>
        <div className="flex flex-col gap-10 flex-1">
          <div className="flex flex-col gap-4">
            <SectionLabel className="text-[#f50067]">
              Příběh za značkou MiK
            </SectionLabel>
            <h1 className="font-['Cormorant_Garamond:Regular'] font-normal leading-[1.1] text-[#7a4e38] text-4xl lg:text-5xl xl:text-[56px]">
              Nenašla jsem módu, kterou bych chtěla nosit. Tak jsem si ji začala navrhovat sama.
            </h1>
          </div>
          <div className="flex flex-col gap-5 font-['Manrope:Regular'] font-normal leading-[1.7] text-[#7a4e38] text-[16px] opacity-90">
            <p>
              Chyběly mi barvy, ženskost a modely, které mají energii, nespoutanost a radost ze života. Nechtěla jsem oblečení, ve kterém se budu schovávat, krotit nebo zapadat. A tak vznikla MiK.
            </p>
            <p>
              Tvořím pro ženy, které milují život, sebe a chtějí se ve svých šatech cítit svobodně, žensky a trochu nebezpečně. Nechci tvořit další „správné" oblečení. Chci tvořit modely, které si obléknete a něco se stane. Narovnáte se. Usmějete se. Možná budete trochu víc flirtovat.
            </p>
          </div>
          <div className="border-l-[3px] border-[#f50067] pl-6">
            <p className="font-['Cormorant_Garamond:Italic'] font-normal italic leading-[1.3] text-[#f50067] text-2xl lg:text-[32px]">
              „Buď barevná. Buď odvážná. Buď ženská. A hlavně buď svoje."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HelpStoriesSection({
  id,
  minFullPage = false,
}: {
  id?: string;
  minFullPage?: boolean;
}) {
  return (
    <section
      id={id}
      className={`bg-black px-5 sm:px-10 lg:px-20 py-24 lg:py-[120px]${
        minFullPage ? " min-h-[calc(100dvh-76px)] sm:min-h-[calc(100dvh-84px)]" : ""
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-20 items-center">
        <div className="flex flex-col gap-10 flex-1">
          <div className="flex flex-col gap-6">
            <SectionLabel className="text-[#c3a06b]">
              Příběhy s hlubším smyslem
            </SectionLabel>
            <h2 className="font-['Cormorant_Garamond:Regular'] font-normal leading-[1.1] text-[#e6d4ae] text-4xl lg:text-5xl xl:text-[64px]">
              Krása může měnit příběhy.
            </h2>
            <p className="font-['Manrope:Regular'] font-normal leading-[1.8] text-[#e6d4ae] text-[16px] opacity-80">
              Protéza je přirozenou součástí mého života i mého příběhu. Nikdy jsem ji nechtěla schovávat a nechci, aby to museli dělat i jiní. Chci, aby móda MiK pomáhala psát příběhy s větší svobodou a radostí.
            </p>
            <p className="font-['Manrope:Regular'] font-normal leading-[1.8] text-[#e6d4ae] text-[16px] opacity-80">
              Část výtěžku z prodeje každé kolekce putuje přímo na podporu konkrétního člověka, kterého osobně vybírám, a pomáhá mu financovat pořízení moderní bionické protézy. Každá kolekce tak dává vzniknout novému příběhu pomoci a návratu k nespoutanému životu.
            </p>
          </div>
          <div className="flex flex-wrap gap-8 items-center">
            <button className="bg-[#f50067] border border-[#f50067] px-6 sm:px-9 py-3 sm:py-4 font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[12px] sm:text-[14px] tracking-[1.5px] sm:tracking-[2px] uppercase text-center hover:bg-[#d4005a] transition-colors">
              Poznat aktuální příběh
            </button>
            <button className="font-['Manrope:SemiBold'] font-semibold text-[#c3a06b] text-[14px] tracking-[1px] uppercase underline decoration-solid hover:text-[#e6d4ae] transition-colors">
              Jak společně pomáháme
            </button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[380px] lg:mx-0 lg:w-[400px] lg:max-w-none shrink-0 aspect-[380/500] relative overflow-hidden border border-[#c3a06b] bg-black">
          <img alt="MiK na tenisovém kurtu" className="absolute inset-0 w-full h-full object-cover object-center" src={imgRectangle8} />
        </div>
      </div>
    </section>
  );
}

function StorefrontDoorMark({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <>
      <div
        className={`absolute top-[32%] sm:top-[36%] -translate-y-1/2 ${
          isLeft ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"
        }`}
      >
        <div className="aspect-[360/270] w-[min(56vw,300px)] sm:w-[min(42vw,360px)] lg:w-[420px] xl:w-[500px]">
          <img alt="" className="h-full w-full object-contain" src={imgHeaderLogo} />
        </div>
      </div>
      <div
        className={`absolute top-[62%] sm:top-[60%] flex flex-col gap-2.5 sm:gap-3.5 ${
          isLeft ? "right-[11%] sm:right-[13%] items-end" : "left-[11%] sm:left-[13%] items-start"
        }`}
      >
        <div className="relative h-1 w-14 sm:w-20 lg:w-24">
          <img alt="" className="absolute inset-0 h-full w-full" src={imgLineAccentTop} />
        </div>
        <p className="font-['Cormorant_Garamond:SemiBold'] sm:font-['Cormorant_Garamond:Light'] font-semibold sm:font-light uppercase text-[#7a4e38] sm:text-[#e6d4ae] text-[15px] sm:text-sm lg:text-lg xl:text-[22px] tracking-[0.16em] sm:tracking-[0.3em] lg:tracking-[0.38em] [text-shadow:0_1px_0_rgba(255,250,240,0.85),0_2px_6px_rgba(122,78,56,0.28)] sm:[text-shadow:0_2px_8px_rgba(0,0,0,0.5)] whitespace-nowrap">
          {isLeft ? "Vítej v" : "mém světě"}
        </p>
        <div className="relative h-1.5 w-16 sm:w-24 lg:w-32">
          <img alt="" className="absolute inset-0 h-full w-full" src={imgLineAccentBottom} />
        </div>
      </div>
    </>
  );
}

const SHOW_STUDIO_AND_ARCHIVE = false;

const navItems = [
  { href: "#pribehy", label: "O značce" },
  { href: "#kolekce", label: "Kolekce" },
  { href: "#pomahame", label: "Pomáháme" },
  { href: "#kontakt", label: "Kontakt" },
];

const lookbookItems = [
  { img: imgRectangle3 },
  { img: imgRectangle4 },
  { img: imgRectangle5 },
  { img: null },
  { img: null },
];

const archiveItems = [
  { img: imgRectangle6, title: "Nespoutaná duše", season: "Podzim / Zima 2023" },
  { img: imgRectangle7, title: "Země a oheň", season: "Jaro / Léto 2023" },
  { img: null, title: "Světlo a stín", season: "Podzim / Zima 2022" },
  { img: null, title: "Prvotní impuls", season: "Jaro / Léto 2022" },
  { img: null, title: "Znovuzrození", season: "Podzim / Zima 2021" },
];

function useImageReady(src: string) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    const markReady = () => {
      if (cancelled) return;
      const finish = () => {
        if (!cancelled) setReady(true);
      };
      if (typeof img.decode === "function") {
        img.decode().then(finish, finish);
      } else {
        finish();
      }
    };
    img.addEventListener("load", markReady);
    img.addEventListener("error", markReady);
    img.src = src;
    if (img.complete) markReady();
    return () => {
      cancelled = true;
      img.removeEventListener("load", markReady);
      img.removeEventListener("error", markReady);
    };
  }, [src]);

  return ready;
}

function useVisibleSlides() {
  const [visibleCount, setVisibleCount] = useState(1);

  useEffect(() => {
    const md = window.matchMedia("(min-width: 768px)");
    const lg = window.matchMedia("(min-width: 1024px)");
    const update = () => setVisibleCount(lg.matches ? 3 : md.matches ? 2 : 1);
    update();
    md.addEventListener("change", update);
    lg.addEventListener("change", update);
    return () => {
      md.removeEventListener("change", update);
      lg.removeEventListener("change", update);
    };
  }, []);

  return visibleCount;
}

function Carousel<T>({
  items,
  renderItem,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const visibleCount = useVisibleSlides();
  const gapPx = 24;
  const max = Math.max(0, items.length - visibleCount);

  useEffect(() => {
    setIndex((i) => Math.min(i, max));
  }, [max]);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(max, i + 1));

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <div className="relative w-full overflow-hidden">
        <div
          className="flex items-stretch transition-transform duration-500"
          style={{
            gap: gapPx,
            transform: `translateX(calc(-${index} * ((100% + ${gapPx}px) / ${visibleCount})))`,
          }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="flex min-w-0 shrink-0"
              style={{ width: `calc((100% - ${(visibleCount - 1) * gapPx}px) / ${visibleCount})` }}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
        {index > 0 && (
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 top-[22%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center"
            aria-label="Předchozí"
          >
            <span className="font-['Manrope:Bold'] text-3xl font-bold leading-none text-[#f50066]">‹</span>
          </button>
        )}
        {index < max && (
          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-[22%] z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center"
            aria-label="Další"
          >
            <span className="font-['Manrope:Bold'] text-3xl font-bold leading-none text-[#f50066]">›</span>
          </button>
        )}
      </div>
      <div className="relative h-2 w-20 shrink-0">
        <img alt="" className="absolute inset-0 h-full w-full max-w-none" src={imgDots} />
      </div>
    </div>
  );
}

const WHATSAPP_NUMBER = "420776090728";

function WhatsAppChat() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim() || "Dobrý den, ráda bych se zeptala na kolekci MiK.";
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      {open && (
        <div className="w-[min(calc(100vw-2.5rem),320px)] overflow-hidden rounded-2xl border border-[rgba(139,106,62,0.45)] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between gap-3 bg-[#1b1412] px-4 py-3">
            <div className="min-w-0">
              <p className="font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[13px] tracking-[1px] uppercase">WhatsApp</p>
              <p className="font-['Manrope:Regular'] text-[#c3a06b] text-[12px] truncate">Michaela Kukletová · +420 776 090 728</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Zavřít chat"
              className="text-[#e6d4ae] text-2xl leading-none px-1 hover:text-white"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-3 px-4 py-4 min-h-[180px]" style={goldSurface}>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#f7f0e6] px-3.5 py-2.5 shadow-sm">
              <p className="font-['Manrope:Regular'] text-[#7a4e38] text-[13px] leading-relaxed">
                Dobrý den, tady Míša. Pokračujte v psaní zprávy – po odeslání se naše konverzace přesune do WhatsAppu.
              </p>
            </div>
          </div>
          <form onSubmit={sendMessage} className="flex items-center gap-2 bg-[#1b1412] px-3 py-3">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Napište zprávu…"
              className="flex-1 min-w-0 bg-transparent outline-none font-['Manrope:Regular'] text-[#e6d4ae] text-[14px] placeholder-[rgba(230,212,174,0.45)] px-2 py-2"
            />
            <button
              type="submit"
              className="bg-[#f50067] hover:bg-[#d4005a] text-[#e6d4ae] font-['Manrope:Bold'] font-bold text-[11px] tracking-[1px] uppercase px-4 py-2.5 rounded-full whitespace-nowrap"
            >
              Odeslat
            </button>
          </form>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Zavřít WhatsApp chat" : "Otevřít WhatsApp chat"}
        className="bg-[#f50067] w-14 h-14 rounded-[28px] flex items-center justify-center shadow-[0_10px_12px_rgba(245,0,103,0.25)] hover:bg-[#d4005a] transition-colors"
      >
        {open ? (
          <span className="text-[#e6d4ae] text-3xl leading-none -mt-0.5">×</span>
        ) : (
          <img alt="" src={imgMessageCircle} style={{ width: 24, height: 24 }} />
        )}
      </button>
    </div>,
    document.body,
  );
}

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "activate" | "error">("idle");
  const [doorsOpen, setDoorsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [legalPage, setLegalPage] = useState<"gdpr" | "terms" | null>(null);
  const [pageView, setPageView] = useState<"home" | "collections" | "contact" | "about" | "help">("home");
  const [collectionRoute, setCollectionRoute] = useState<{
    open: boolean;
    slug: string | null;
    modelSlug: string | null;
  }>({ open: false, slug: null, modelSlug: null });
  const curtainsReady = useImageReady(imgStorefrontCurtains);
  const introReady = useImageReady(imgSectionIntroSplash);
  const featuredCollection = getPublishedCollections()[0];

  async function handleContactSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formStatus === "sending") return;
    setFormStatus("sending");
    try {
      const response = await fetch("https://formsubmit.co/ajax/mik@mikolection.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
          _subject: `Zpráva z webu MiK od ${form.name}`,
          _template: "table",
          _captcha: "false",
        }),
      });
      if (!response.ok) throw new Error("Odeslání se nezdařilo");
      const payload = await response.json();
      if (payload.success === false || payload.success === "false") {
        const needsActivation = typeof payload.message === "string" && payload.message.toLowerCase().includes("activation");
        if (!needsActivation) {
          throw new Error("Odeslání se nezdařilo");
        }
        setFormStatus("activate");
        return;
      }
      setForm({ name: "", email: "", phone: "", message: "" });
      setFormStatus("sent");
    } catch {
      setFormStatus("error");
    }
  }

  useEffect(() => {
    if (!curtainsReady || !introReady) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDoorsOpen(true);
      return;
    }

    let cancelled = false;
    let raf2 = 0;
    let timer = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        timer = window.setTimeout(() => {
          if (!cancelled) setDoorsOpen(true);
        }, 280);
      });
    });
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      window.clearTimeout(timer);
    };
  }, [curtainsReady, introReady]);

  useEffect(() => {
    const syncHash = () => {
      const hash = window.location.hash;
      setMenuOpen(false);
      if (hash === "#gdpr") {
        setLegalPage("gdpr");
        setPageView("home");
        setCollectionRoute({ open: false, slug: null, modelSlug: null });
        return;
      }
      if (hash === "#obchodni-podminky") {
        setLegalPage("terms");
        setPageView("home");
        setCollectionRoute({ open: false, slug: null, modelSlug: null });
        return;
      }
      setLegalPage(null);
      if (hash === "#pribehy") {
        setPageView("about");
        setCollectionRoute({ open: false, slug: null, modelSlug: null });
        return;
      }
      if (hash === "#pomahame") {
        setPageView("help");
        setCollectionRoute({ open: false, slug: null, modelSlug: null });
        return;
      }
      if (hash === "#kontakt") {
        setPageView("contact");
        setCollectionRoute({ open: false, slug: null, modelSlug: null });
        return;
      }
      if (hash === "#kolekce") {
        setPageView("collections");
        setCollectionRoute({ open: true, slug: null, modelSlug: null });
        return;
      }
      const collectionMatch = hash.match(/^#kolekce\/([^/]+)(?:\/([^/]+))?$/);
      if (collectionMatch) {
        setPageView("collections");
        setCollectionRoute({
          open: true,
          slug: decodeURIComponent(collectionMatch[1]),
          modelSlug: collectionMatch[2] ? decodeURIComponent(collectionMatch[2]) : null,
        });
        return;
      }
      setPageView("home");
      setCollectionRoute({ open: false, slug: null, modelSlug: null });
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  useEffect(() => {
    if (pageView === "collections" || pageView === "contact" || pageView === "about" || pageView === "help") {
      window.scrollTo(0, 0);
      return;
    }
    const id = window.location.hash.replace(/^#/, "");
    if (!id || id === "gdpr" || id === "obchodni-podminky") return;
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pageView]);

  function closeLegal() {
    setLegalPage(null);
    if (window.location.hash === "#gdpr" || window.location.hash === "#obchodni-podminky") {
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
  }

  return (
    <div className={`w-full min-h-dvh relative ${pageView === "collections" || pageView === "help" ? "bg-black" : "bg-[#e6d4ae]"}`}>

      {/* HEADER */}
      <header className="mik-site-header border-b border-[#c3a06b] relative z-50 sticky top-0 isolate overflow-visible mix-blend-normal" style={goldSurface}>
        <div className="max-w-[1440px] mx-auto h-full px-5 sm:px-10 lg:px-20 flex items-center justify-between gap-3">
          <a href="#uvod" className="relative z-[1] h-11 w-[128px] sm:h-12 sm:w-[150px] shrink-0 overflow-visible mix-blend-normal" aria-label="MiK — úvodní stránka" onClick={() => setMenuOpen(false)}>
            <div
              className="mik-brand-mark pointer-events-none absolute left-1/2 top-1/2 h-[92px] w-[168px] sm:h-[100px] sm:w-[182px] -translate-x-1/2 -translate-y-1/2 bg-[#f50067]"
              style={{
                WebkitMaskImage: `url(${mikLogoMask})`,
                maskImage: `url(${mikLogoMask})`,
              }}
            />
          </a>
          <div className="flex items-center gap-5 lg:gap-6 shrink-0">
            <nav className="hidden md:flex gap-5 lg:gap-6 items-center font-['Manrope:SemiBold'] font-semibold text-[#7a4e38] text-[13px] lg:text-[14px] tracking-[1.5px] uppercase">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="hover:text-[#f50067] transition-colors">
                  {item.label}
                </a>
              ))}
            </nav>
            <a href="#kolekce" className="hidden md:inline-flex bg-[#f50067] border border-[#f50067] px-4 sm:px-7 lg:px-8 py-2 sm:py-2.5 font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[11px] sm:text-[13px] lg:text-[14px] tracking-[1px] sm:tracking-[2px] uppercase text-center hover:bg-[#d4005a] transition-colors">
              OBJEVIT KOLEKCI
            </a>
            <button
              type="button"
              className="md:hidden relative z-[1] flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px]"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Zavřít menu" : "Otevřít menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className={`block h-[1.5px] w-5 bg-[#7a4e38] transition-transform duration-200 ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
              <span className={`block h-[1.5px] w-5 bg-[#7a4e38] transition-opacity duration-200 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-[1.5px] w-5 bg-[#7a4e38] transition-transform duration-200 ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="md:hidden absolute inset-x-0 top-full border-b border-[#c3a06b] px-5 py-3 flex flex-col"
            style={goldSurface}
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="py-3 font-['Manrope:SemiBold'] font-semibold text-[#7a4e38] text-[13px] tracking-[1.5px] uppercase hover:text-[#f50067] transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#kolekce"
              className="mt-1 mb-2 bg-[#f50067] border border-[#f50067] px-4 py-2.5 font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[12px] tracking-[1.5px] uppercase text-center hover:bg-[#d4005a] transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              OBJEVIT KOLEKCI
            </a>
          </nav>
        )}
      </header>

      {pageView === "collections" ? <CollectionsIndex /> : null}

      <div className={pageView !== "home" ? "hidden" : undefined}>
      {/* HERO SPLASH — self-opening storefront */}
      <section id="uvod" className="storefront-viewport relative w-full overflow-hidden">
        {/* Photo behind the window — CSS layer is always present so body black never shows */}
        <div className="storefront-photo absolute inset-0">
          <img
            alt="Pohled do ateliéru MiK"
            className="absolute inset-0 h-full w-full object-cover object-center bg-[#e6d4ae]"
            src={imgSectionIntroSplash}
            fetchPriority="high"
            decoding="async"
          />
        </div>

        {/* Sliding glass doors */}
        <div aria-hidden className="absolute inset-0 z-20 pointer-events-none">
          <div className={`storefront-door storefront-door-left absolute inset-y-0 left-0 w-1/2 ${doorsOpen ? "is-open" : ""}`}>
            <div className="absolute inset-0 overflow-hidden border-r border-[rgba(247,240,230,0.55)] shadow-[6px_0_18px_rgba(33,24,25,0.18)] bg-[#e6d4ae]">
              <div
                className="absolute inset-0 bg-[#e6d4ae]"
                style={{
                  backgroundImage: `url(${imgStorefrontCurtains})`,
                  backgroundSize: "auto 108%",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "left top",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(247,240,230,0.18) 0%, rgba(195,160,107,0.38) 28%, rgba(247,240,230,0.52) 52%, rgba(195,160,107,0.32) 78%, rgba(33,24,25,0.28) 100%)",
                }}
              />
              <div className="absolute inset-0 bg-[rgba(33,24,25,0.12)]" />
              <div className="absolute rotate-12 origin-center" style={{ left: "8%", top: "-8%", width: "28%", height: "80%" }}>
                <div className="w-full h-full" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 30%, rgba(255,232,160,0.28) 50%, rgba(255,255,255,0.12) 70%, rgba(255,255,255,0) 100%)" }} />
              </div>
              <StorefrontDoorMark side="left" />
              <div className="absolute inset-y-0 right-0 w-[10px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(139,106,62,0.2), rgb(247,240,230), rgb(195,160,107))" }} />
              <div className="absolute rounded-[30px] border border-[rgba(195,160,107,0.7)] shadow-[2px_4px_8px_0_rgba(0,0,0,0.38)]" style={{ right: "4.5%", top: "46%", width: "8.4%", height: "7.8%", backgroundImage: "linear-gradient(90deg, rgb(195,160,107) 0%, rgb(247,240,230) 40%, rgb(195,160,107) 70%, rgb(139,106,62) 100%)" }} />
              <div className="absolute mix-blend-screen" style={{ left: "18%", top: "13%" }}>
                <img alt="" src={imgLensFlareLeft} style={{ width: 120, height: 120 }} />
              </div>
            </div>
          </div>

          <div className={`storefront-door storefront-door-right absolute inset-y-0 right-0 w-1/2 ${doorsOpen ? "is-open" : ""}`}>
            <div className="absolute inset-0 overflow-hidden border-l border-[rgba(247,240,230,0.55)] shadow-[-6px_0_18px_rgba(33,24,25,0.18)] bg-[#e6d4ae]">
              <div
                className="absolute inset-0 bg-[#e6d4ae]"
                style={{
                  backgroundImage: `url(${imgStorefrontCurtains})`,
                  backgroundSize: "auto 108%",
                  backgroundRepeat: "repeat-x",
                  backgroundPosition: "right top",
                  transform: "scaleX(-1)",
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(270deg, rgba(247,240,230,0.18) 0%, rgba(195,160,107,0.38) 28%, rgba(247,240,230,0.52) 52%, rgba(195,160,107,0.32) 78%, rgba(33,24,25,0.28) 100%)",
                }}
              />
              <div className="absolute inset-0 bg-[rgba(33,24,25,0.12)]" />
              <div className="absolute -rotate-12 origin-center" style={{ right: "8%", top: "-8%", width: "28%", height: "80%" }}>
                <div className="w-full h-full" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.18) 30%, rgba(255,232,160,0.28) 50%, rgba(255,255,255,0.12) 70%, rgba(255,255,255,0) 100%)" }} />
              </div>
              <StorefrontDoorMark side="right" />
              <div className="absolute inset-y-0 left-0 w-[10px]" style={{ backgroundImage: "linear-gradient(90deg, rgb(195,160,107), rgb(247,240,230), rgba(139,106,62,0.2))" }} />
              <div className="absolute rounded-[30px] border border-[rgba(195,160,107,0.7)] shadow-[2px_4px_8px_0_rgba(0,0,0,0.38)]" style={{ left: "4.5%", top: "46%", width: "8.4%", height: "7.8%", backgroundImage: "linear-gradient(90deg, rgb(139,106,62) 0%, rgb(195,160,107) 30%, rgb(247,240,230) 60%, rgb(195,160,107) 100%)" }} />
              <div className="absolute mix-blend-screen" style={{ right: "18%", top: "13%" }}>
                <img alt="" src={imgLensFlareRight} style={{ width: 120, height: 120 }} />
              </div>
            </div>
          </div>

          <div className={`absolute top-0 bottom-0 left-1/2 z-10 w-[3px] -translate-x-1/2 transition-opacity duration-[1400ms] ${doorsOpen ? "opacity-0" : "opacity-100"}`} style={{ backgroundImage: "linear-gradient(180deg, rgba(195,160,107,0) 0%, rgba(247,240,230,0.8) 15%, rgb(255,232,160) 35%, rgb(255,250,224) 50%, rgb(255,232,160) 65%, rgba(247,240,230,0.8) 85%, rgba(195,160,107,0) 100%)" }} />
        </div>
      </section>

      {featuredCollection ? (
        <section className="relative overflow-hidden bg-black px-5 sm:px-10 lg:px-20 py-24 lg:py-[140px]">
          <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col gap-10 lg:gap-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
              <div className="flex flex-col gap-4 max-w-[700px]">
                <SectionLabel className="text-[#f50067]">
                  Aktuální kolekce
                </SectionLabel>
                <h2 className="font-['Cormorant_Garamond:Regular'] font-normal leading-[1.15] text-[#e6d4ae] text-[32px] sm:text-5xl lg:text-[64px]">
                  {featuredCollection.name}
                </h2>
                {featuredCollection.intro ? (
                  <p className="font-['Manrope:Regular'] font-normal leading-[1.6] text-[#e6d4ae] text-[15px] sm:text-[18px] opacity-80">
                    {featuredCollection.intro}
                  </p>
                ) : null}
              </div>
              <a
                href="#kolekce"
                className="border border-[#c3a06b] px-6 sm:px-9 py-3 sm:py-4 font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[12px] sm:text-[14px] tracking-[1.5px] sm:tracking-[2px] uppercase text-center w-full sm:w-auto shrink-0 hover:bg-[#c3a06b] hover:text-[#1b1412] transition-colors"
              >
                Všechny kolekce
              </a>
            </div>
            <div className="mx-auto grid w-full max-w-[1040px] grid-cols-3 gap-2 sm:gap-6 md:gap-8">
              {featuredCollection.models.map((model) => (
                <a
                  key={model.id}
                  href={`#kolekce/${featuredCollection.slug}/${model.slug}`}
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
          </div>
        </section>
      ) : null}

      <BrandStorySection />

      {/* LOOKBOOK / SHOWROOM — hidden until content is ready */}
      {SHOW_STUDIO_AND_ARCHIVE && (
      <section className="bg-black px-5 sm:px-10 lg:px-20 py-24 lg:py-[140px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-14">
          <div className="flex flex-col gap-3">
            <SectionLabel className="text-[#f50066]">
              MiK Atelier
            </SectionLabel>
            <h2 className="font-['Cormorant_Garamond:Regular'] font-normal text-[#e6d4ae] text-4xl lg:text-[48px]">
              Pohled do showroomu
            </h2>
          </div>
          <Carousel
            items={lookbookItems}
            renderItem={(item) => (
              <div className="flex h-full w-full flex-col">
                <div className="aspect-[405/448] relative overflow-hidden bg-[#c3a06b] shrink-0">
                  {(item as any).img && <img alt="" className="absolute inset-0 w-full h-full object-cover" src={(item as any).img} />}
                </div>
                <div className="mt-auto flex justify-end pt-4">
                  <button className="border border-[#f50066] px-3 sm:px-4 py-2 font-['Manrope:Bold'] font-bold text-[#f50066] text-[10px] sm:text-[11px] tracking-[0.8px] sm:tracking-[1px] uppercase text-center hover:bg-[#f50066] hover:text-[#e6d4ae] transition-colors">
                    Detail modelu
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      </section>
      )}

      {/* ARCHIVE / PREVIOUS COLLECTIONS — hidden until content is ready */}
      {SHOW_STUDIO_AND_ARCHIVE && (
      <section className="relative overflow-hidden px-5 sm:px-10 lg:px-20 py-24 lg:py-[140px]" style={goldSurface}>
        <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col gap-14">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6">
            <div className="flex flex-col gap-3">
              <SectionLabel className="text-[#f50066] opacity-60">
                Archiv tvorby
              </SectionLabel>
              <h2 className="font-['Cormorant_Garamond:Regular'] font-normal text-[#7a4e38] text-4xl lg:text-[48px]">
                Předchozí kolekce
              </h2>
            </div>
            <button className="border border-[#7a4e38] px-6 sm:px-9 py-3 sm:py-4 font-['Manrope:Bold'] font-bold text-[#7a4e38] text-[12px] sm:text-[14px] tracking-[1.5px] sm:tracking-[2px] uppercase text-center w-full sm:w-auto shrink-0 hover:bg-[#7a4e38] hover:text-[#e6d4ae] transition-colors">
              Prohlédnout všechny kolekce
            </button>
          </div>
          <Carousel
            items={archiveItems}
            renderItem={(item) => (
              <div className="flex h-full w-full min-w-0 flex-col">
                <div className="aspect-[3/4] relative overflow-hidden bg-[#c3a06b] shrink-0">
                  {(item as any).img ? (
                    <img alt="" className="absolute inset-0 w-full h-full object-cover" src={(item as any).img} />
                  ) : (
                    <p className="absolute inset-0 flex items-center justify-center px-3 font-['Manrope:SemiBold'] text-[11px] tracking-[2px] uppercase text-[#7a4e38]/40 text-center">
                      Připravujeme
                    </p>
                  )}
                </div>
                <div className="flex min-w-0 flex-1 flex-col pt-4">
                  <p className="font-['Cormorant_Garamond:SemiBold'] font-semibold text-[#7a4e38] text-[20px] sm:text-[24px] leading-snug">
                    {(item as any).title}
                  </p>
                  <p className="font-['Manrope:Regular'] font-normal text-[#7a4e38] text-[13px] sm:text-[14px] leading-snug opacity-50 mt-1">
                    {(item as any).season}
                  </p>
                  <button className="mt-4 w-full min-h-[48px] border border-[#f50067] px-2 sm:px-4 py-2.5 font-['Manrope:Bold'] font-bold text-[#f50067] text-[10px] sm:text-[11px] tracking-[0.12em] uppercase text-center leading-tight hover:bg-[#f50067] hover:text-[#e6d4ae] transition-colors">
                    Prohlédnout kolekci
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      </section>
      )}

      <HelpStoriesSection />
      </div>

      {pageView === "about" ? <BrandStorySection id="pribehy" minFullPage /> : null}

      {pageView === "help" ? <HelpStoriesSection id="pomahame" minFullPage /> : null}

      {pageView === "contact" ? (
      <section id="kontakt" className="relative overflow-hidden px-5 sm:px-10 lg:px-20 py-24 lg:py-[140px] min-h-[calc(100dvh-76px)] sm:min-h-[calc(100dvh-84px)]" style={goldSurface}>
        <div className="relative z-10 max-w-[1440px] mx-auto flex flex-col lg:flex-row items-start justify-between gap-16">
          {/* Left: info */}
          <div className="flex flex-col gap-8 lg:w-[500px] shrink-0">
            <div className="flex flex-col gap-4">
              <SectionLabel className="text-[#f50067]">
                Napište mi
              </SectionLabel>
              <h2 className="font-['Cormorant_Garamond:Regular'] font-normal leading-[1.1] text-[#7a4e38] text-4xl lg:text-[56px]">
                Zaujal Vás některý model?
              </h2>
            </div>
            <p className="font-['Manrope:Regular'] font-normal leading-[1.7] text-[#7a4e38] text-[16px] opacity-80">
              Ráda Vám řeknu víc o dostupnosti látek, konkrétních velikostech, ceně na dotaz nebo o možnostech individuální úpravy na míru Vaší osobnosti. Každý kus tvořím s láskou a osobní péčí.
            </p>
            <div className="flex flex-col gap-3 font-normal text-[#7a4e38] text-[14px]">
              <p className="font-['Manrope:Bold'] font-bold">Michaela Kukletová</p>
              <div className="flex flex-col gap-1 font-['Manrope:Regular'] opacity-70">
                <a href="mailto:mik@mikolection.com" className="hover:opacity-100">mik@mikolection.com</a>
                <a href="tel:+420776090728" className="hover:opacity-100">+420 776 090 728</a>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <form
            onSubmit={handleContactSubmit}
            className="border border-[rgba(139,106,62,0.65)] p-6 sm:p-10 lg:p-12 flex flex-col gap-9 w-full lg:w-[560px] shrink-0 shadow-[0_18px_40px_rgba(0,0,0,0.12)]"
            style={goldSurface}
          >
            <div className="flex flex-col gap-6">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center text-[12px] whitespace-nowrap">
                  <span className="font-['Manrope:SemiBold'] font-semibold text-[#7a4e38] tracking-[1px] uppercase">JMÉNO A PŘÍJMENÍ</span>
                  <span className="font-['Manrope:Regular'] text-[#f50067]">*</span>
                </div>
                <input
                  name="name"
                  required
                  autoComplete="name"
                  className="border-b border-[#7a4e38] px-4 py-3.5 font-['Manrope:Regular'] font-normal text-[15px] text-[#7a4e38] placeholder-[rgba(122,78,56,0.55)] bg-transparent w-full outline-none"
                  placeholder="Napište své jméno"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              {/* Email */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center text-[12px]">
                  <span className="font-['Manrope:SemiBold'] font-semibold text-[#7a4e38] tracking-[1px] uppercase">E-mailová adresa</span>
                  <span className="font-['Manrope:Regular'] text-[#f50067]">*</span>
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="border-b border-[#7a4e38] px-4 py-3.5 font-['Manrope:Regular'] font-normal text-[15px] text-[#7a4e38] placeholder-[rgba(122,78,56,0.55)] bg-transparent w-full outline-none"
                  placeholder="vas.email@domena.cz"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              {/* Phone */}
              <div className="flex flex-col gap-2">
                <div className="flex gap-1 items-center text-[12px]">
                  <span className="font-['Manrope:SemiBold'] font-semibold text-[#7a4e38] tracking-[1px] uppercase">Telefon</span>
                  <span className="font-['Manrope:Regular'] text-[#f50067]">*</span>
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  autoComplete="tel"
                  className="border-b border-[#7a4e38] px-4 py-3.5 font-['Manrope:Regular'] font-normal text-[15px] text-[#7a4e38] placeholder-[rgba(122,78,56,0.55)] bg-transparent w-full outline-none"
                  placeholder="+420 000 000 000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              {/* Message */}
              <div className="flex flex-col gap-2">
                <span className="font-['Manrope:SemiBold'] font-semibold text-[#7a4e38] text-[12px] tracking-[1px] uppercase">Vaše zpráva</span>
                <textarea
                  name="message"
                  className="border-b border-[#7a4e38] px-4 py-3.5 font-['Manrope:Regular'] font-normal text-[15px] text-[#7a4e38] placeholder-[rgba(122,78,56,0.55)] bg-transparent w-full outline-none resize-none min-h-[80px]"
                  placeholder="Napište mi, co Vás zajímá, nebo jaké úpravy byste si přála..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={formStatus === "sending"}
              className="bg-[#f50066] border border-[#7a4e38] px-9 py-4 font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[14px] tracking-[2px] uppercase w-full hover:bg-[#d4005a] transition-colors disabled:opacity-60"
            >
              {formStatus === "sending" ? "Odesílám…" : "Odeslat zprávu"}
            </button>
            {formStatus === "sent" && (
              <p className="font-['Manrope:Regular'] text-[#7a4e38] text-[14px] text-center">
                Děkuji, zpráva byla odeslána na mik@mikolection.com.
              </p>
            )}
            {formStatus === "activate" && (
              <p className="font-['Manrope:Regular'] text-[#7a4e38] text-[14px] text-center">
                Na mik@mikolection.com právě přišel aktivační e-mail. Po kliknutí na odkaz v něm budou další zprávy z formuláře chodit automaticky.
              </p>
            )}
            {formStatus === "error" && (
              <p className="font-['Manrope:Regular'] text-[#f50067] text-[14px] text-center">
                Odeslání se nepovedlo. Zkuste to prosím znovu, nebo napište přímo na mik@mikolection.com.
              </p>
            )}
          </form>
        </div>
      </section>
      ) : null}

      {/* FOOTER */}
      <footer className="bg-black border-t border-[#c3a06b] px-5 sm:px-10 lg:px-20 pt-20 pb-12">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-16">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-12">
            {/* Logo + tagline */}
            <div className="flex flex-col gap-6 w-full lg:w-[300px]">
              <div className="w-[160px] h-[120px] relative">
                <img alt="MiK" className="absolute inset-0 w-full h-full object-cover" src={imgHeaderLogo} />
              </div>
              <p className="font-['Manrope:Regular'] font-normal text-[#e6d4ae] text-[13px] leading-normal opacity-60">
                Autorská módní značka designérky MiK. Tvořeno s vášní, barvami a nespoutanou radostí ze života.
              </p>
            </div>
            {/* Nav columns */}
            <div className="flex flex-col gap-4">
                <p className="font-['Manrope:Bold'] font-bold text-[#c3a06b] text-[12px] tracking-[2px] uppercase">Menu</p>
                <a href="#pribehy" className="font-['Manrope:Regular'] font-normal text-[#e6d4ae] text-[14px] opacity-80 hover:opacity-100 transition-opacity">O značce</a>
                <a href="#kolekce" className="font-['Manrope:Regular'] font-normal text-[#e6d4ae] text-[14px] opacity-80 hover:opacity-100 transition-opacity">Kolekce</a>
                <a href="#pomahame" className="font-['Manrope:Regular'] font-normal text-[#e6d4ae] text-[14px] opacity-80 hover:opacity-100 transition-opacity">Pomáháme</a>
                <a href="#kontakt" className="font-['Manrope:Regular'] font-normal text-[#e6d4ae] text-[14px] opacity-80 hover:opacity-100 transition-opacity">Kontakt</a>
              </div>
            <div className="flex flex-col gap-4 max-w-[360px]">
              <p className="font-['Manrope:Bold'] font-bold text-[#c3a06b] text-[12px] tracking-[2px] uppercase">Provozovatel</p>
              <p className="font-['Manrope:Regular'] font-normal text-[#e6d4ae] text-[14px] opacity-80 leading-relaxed">
                Michaela Kukletová<br />
                Autorská módní značka MiK<br />
                <a href="mailto:mik@mikolection.com" className="hover:opacity-100">mik@mikolection.com</a><br />
                <a href="tel:+420776090728" className="hover:opacity-100">+420 776 090 728</a>
              </p>
              <p className="font-['Manrope:Regular'] font-normal text-[#e6d4ae] text-[13px] opacity-50 leading-relaxed">
                Web slouží k prezentaci tvorby a poptávkám. Smlouva vzniká až potvrzením objednávky. IČO a sídlo budou uvedeny na daňovém dokladu.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px relative w-full">
            <img alt="" className="block w-full h-full" src={imgLine1} />
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-['Manrope:Regular'] font-normal text-[#e6d4ae] text-[13px]">
            <p className="opacity-40">Copyright © 2026 MiK Fashion. Všechna práva vyhrazena.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <a href="#gdpr" className="opacity-40 hover:opacity-70 transition-opacity">Ochrana osobních údajů</a>
              <a href="#obchodni-podminky" className="opacity-40 hover:opacity-70 transition-opacity">Obchodní podmínky</a>
            </div>
          </div>
        </div>
      </footer>
      <WhatsAppChat />
      {legalPage === "gdpr" && <LegalPage doc={privacyPolicy} onClose={closeLegal} />}
      {legalPage === "terms" && <LegalPage doc={termsOfService} onClose={closeLegal} />}
      {(() => {
        if (!collectionRoute.open || !collectionRoute.slug || !collectionRoute.modelSlug) return null;
        const collection = getCollectionBySlug(collectionRoute.slug);
        if (!collection?.published) return null;
        const model = getModelBySlug(collection, collectionRoute.modelSlug);
        if (!model) return null;
        return (
          <ModelGallery
            collection={collection}
            model={model}
            onClose={() => {
              window.location.hash = "#kolekce";
            }}
          />
        );
      })()}
    </div>
  );
}
