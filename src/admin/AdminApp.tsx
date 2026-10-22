import { useEffect, useMemo, useState, type FormEvent } from "react";
import { siteContentDefaults, type SiteContent } from "../content/site";

type SectionId = "hero" | "about" | "help" | "contact" | "footer" | "collections" | "account";

const sections: { id: SectionId; label: string }[] = [
  { id: "hero", label: "Úvod" },
  { id: "about", label: "O značce" },
  { id: "help", label: "Pomáháme" },
  { id: "contact", label: "Kontakt" },
  { id: "footer", label: "Patička" },
  { id: "collections", label: "Kolekce" },
  { id: "account", label: "Účet" },
];

const goldSurface = {
  backgroundColor: "rgb(213, 188, 121)",
  backgroundImage:
    "linear-gradient(115deg, rgba(255,247,217,0) 16%, rgba(255,250,229,0.22) 50%, rgba(255,247,217,0) 84%)",
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const className =
    "w-full bg-transparent border-b border-[#7a4e38] px-0 py-3 font-['Manrope:Regular'] text-[15px] text-[#7a4e38] outline-none placeholder-[rgba(122,78,56,0.45)]";
  return (
    <label className="flex flex-col gap-2">
      <span className="font-['Manrope:SemiBold'] font-semibold text-[#7a4e38] text-[11px] tracking-[1.4px] uppercase">
        {label}
      </span>
      {multiline ? (
        <textarea className={`${className} min-h-[120px] resize-y`} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={className} type={type} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...(init?.headers || {}) },
    ...init,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Požadavek se nepovedl.");
  }
  return payload as T;
}

export default function AdminApp() {
  const [email, setEmail] = useState("iveta.kustera@gmail.com");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [section, setSection] = useState<SectionId>("hero");
  const [content, setContent] = useState<SiteContent>(siteContentDefaults);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    document.title = "MiK — administrace";
    let cancelled = false;
    api<{ email: string }>("/api/admin/me")
      .then((payload) => {
        if (!cancelled) setUser(payload.email);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    api<SiteContent>("/api/content")
      .then((payload) => setContent({ ...siteContentDefaults, ...payload }))
      .catch(() => {});
  }, [user]);

  const publishedCount = useMemo(
    () => content.collections.filter((item) => item.published).length,
    [content.collections],
  );

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = await api<{ email: string }>("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setUser(payload.email);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Přihlášení se nepovedlo.");
    } finally {
      setBusy(false);
    }
  }

  async function forgotPassword() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = await api<{ message?: string; activate?: boolean }>("/api/admin/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage(
        payload.message ||
          "Pokud je e-mail správný, nové heslo teď přijde do schránky.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Odeslání se nepovedlo.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await api("/api/admin/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }

  async function saveContent() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api("/api/content", { method: "PUT", body: JSON.stringify(content) });
      setMessage("Úpravy jsou uložené a hned se projeví na webu.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Uložení se nepovedlo.");
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api("/api/admin/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Heslo je změněné.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Heslo se nepodařilo změnit.");
    } finally {
      setBusy(false);
    }
  }

  if (checking) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={goldSurface}>
        <p className="font-['Manrope:Regular'] text-[#7a4e38]">Načítám…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-5" style={goldSurface}>
        <form onSubmit={login} className="w-full max-w-[420px] flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <p className="font-['Manrope:Bold'] text-[#f50067] text-[12px] tracking-[2px] uppercase">Administrace MiK</p>
            <h1 className="font-['Cormorant_Garamond:Regular'] text-[#7a4e38] text-4xl leading-tight">Přihlášení</h1>
          </div>
          <Field label="E-mail" value={email} onChange={setEmail} type="email" />
          <Field label="Heslo" value={password} onChange={setPassword} type="password" />
          {error ? <p className="font-['Manrope:Regular'] text-[#f50067] text-[14px]">{error}</p> : null}
          {message ? <p className="font-['Manrope:Regular'] text-[#7a4e38] text-[14px]">{message}</p> : null}
          <button
            type="submit"
            disabled={busy}
            className="bg-[#f50067] px-8 py-4 font-['Manrope:Bold'] font-bold text-[#e6d4ae] text-[13px] tracking-[2px] uppercase hover:bg-[#d4005a] disabled:opacity-60"
          >
            {busy ? "Přihlašuji…" : "Přihlásit se"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={forgotPassword}
            className="font-['Manrope:SemiBold'] text-[#7a4e38] text-[13px] tracking-[1px] uppercase underline"
          >
            Poslat nové heslo na e-mail
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-black text-[#e6d4ae]">
      <header className="border-b border-[#c3a06b] px-5 sm:px-8 py-4 flex items-center justify-between gap-4" style={goldSurface}>
        <div>
          <p className="font-['Manrope:Bold'] text-[#f50067] text-[11px] tracking-[2px] uppercase">Administrace</p>
          <p className="font-['Manrope:Regular'] text-[#7a4e38] text-[13px]">{user}</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="font-['Manrope:SemiBold'] text-[#7a4e38] text-[12px] tracking-[1px] uppercase underline">
            Web
          </a>
          <button
            type="button"
            onClick={logout}
            className="border border-[#7a4e38] px-4 py-2 font-['Manrope:Bold'] text-[#7a4e38] text-[11px] tracking-[1.5px] uppercase"
          >
            Odhlásit
          </button>
        </div>
      </header>

      <div className="max-w-[1180px] mx-auto px-5 sm:px-8 py-10 flex flex-col lg:flex-row gap-10">
        <nav className="lg:w-[220px] shrink-0 flex flex-col gap-1">
          {sections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSection(item.id)}
              className={`text-left px-4 py-3 font-['Manrope:SemiBold'] text-[12px] tracking-[1.5px] uppercase ${
                section === item.id ? "bg-[#c3a06b] text-[#1b1412]" : "text-[#e6d4ae] hover:text-[#c3a06b]"
              }`}
            >
              {item.label}
            </button>
          ))}
          <p className="mt-4 px-4 font-['Manrope:Regular'] text-[12px] text-[#e6d4ae]/50">
            Zveřejněné kolekce: {publishedCount}
          </p>
        </nav>

        <div className="flex-1 flex flex-col gap-8">
          {section === "hero" ? (
            <div className="flex flex-col gap-6 p-6 sm:p-8" style={goldSurface}>
              <h2 className="font-['Cormorant_Garamond:Regular'] text-[#7a4e38] text-3xl">Úvod</h2>
              <Field label="Levé dveře" value={content.hero.welcomeLeft} onChange={(welcomeLeft) => setContent({ ...content, hero: { ...content.hero, welcomeLeft } })} />
              <Field label="Pravé dveře" value={content.hero.welcomeRight} onChange={(welcomeRight) => setContent({ ...content, hero: { ...content.hero, welcomeRight } })} />
              <Field label="Tlačítko v menu" value={content.nav.cta} onChange={(cta) => setContent({ ...content, nav: { ...content.nav, cta } })} />
              <Field label="Popisek aktuální kolekce" value={content.featured.label} onChange={(label) => setContent({ ...content, featured: { ...content.featured, label } })} />
              <Field label="Odkaz na všechny kolekce" value={content.featured.allCollections} onChange={(allCollections) => setContent({ ...content, featured: { ...content.featured, allCollections } })} />
            </div>
          ) : null}

          {section === "about" ? (
            <div className="flex flex-col gap-6 p-6 sm:p-8" style={goldSurface}>
              <h2 className="font-['Cormorant_Garamond:Regular'] text-[#7a4e38] text-3xl">O značce</h2>
              <Field label="Nadpis sekce" value={content.about.label} onChange={(label) => setContent({ ...content, about: { ...content.about, label } })} />
              <Field label="Titulek" value={content.about.title} onChange={(title) => setContent({ ...content, about: { ...content.about, title } })} multiline />
              <Field label="Odstavec 1" value={content.about.paragraphs[0] || ""} onChange={(value) => setContent({ ...content, about: { ...content.about, paragraphs: [value, content.about.paragraphs[1] || ""] } })} multiline />
              <Field label="Odstavec 2" value={content.about.paragraphs[1] || ""} onChange={(value) => setContent({ ...content, about: { ...content.about, paragraphs: [content.about.paragraphs[0] || "", value] } })} multiline />
              <Field label="Motto" value={content.about.quote} onChange={(quote) => setContent({ ...content, about: { ...content.about, quote } })} multiline />
            </div>
          ) : null}

          {section === "help" ? (
            <div className="flex flex-col gap-6 p-6 sm:p-8" style={goldSurface}>
              <h2 className="font-['Cormorant_Garamond:Regular'] text-[#7a4e38] text-3xl">Pomáháme</h2>
              <Field label="Nadpis sekce" value={content.help.label} onChange={(label) => setContent({ ...content, help: { ...content.help, label } })} />
              <Field label="Titulek" value={content.help.title} onChange={(title) => setContent({ ...content, help: { ...content.help, title } })} multiline />
              <Field label="Odstavec 1" value={content.help.paragraphs[0] || ""} onChange={(value) => setContent({ ...content, help: { ...content.help, paragraphs: [value, content.help.paragraphs[1] || ""] } })} multiline />
              <Field label="Odstavec 2" value={content.help.paragraphs[1] || ""} onChange={(value) => setContent({ ...content, help: { ...content.help, paragraphs: [content.help.paragraphs[0] || "", value] } })} multiline />
              <Field label="Hlavní tlačítko" value={content.help.ctaPrimary} onChange={(ctaPrimary) => setContent({ ...content, help: { ...content.help, ctaPrimary } })} />
              <Field label="Druhé tlačítko" value={content.help.ctaSecondary} onChange={(ctaSecondary) => setContent({ ...content, help: { ...content.help, ctaSecondary } })} />
            </div>
          ) : null}

          {section === "contact" ? (
            <div className="flex flex-col gap-6 p-6 sm:p-8" style={goldSurface}>
              <h2 className="font-['Cormorant_Garamond:Regular'] text-[#7a4e38] text-3xl">Kontakt</h2>
              <Field label="Nadpis sekce" value={content.contact.label} onChange={(label) => setContent({ ...content, contact: { ...content.contact, label } })} />
              <Field label="Titulek" value={content.contact.title} onChange={(title) => setContent({ ...content, contact: { ...content.contact, title } })} />
              <Field label="Úvod" value={content.contact.intro} onChange={(intro) => setContent({ ...content, contact: { ...content.contact, intro } })} multiline />
              <Field label="Jméno" value={content.contact.person} onChange={(person) => setContent({ ...content, contact: { ...content.contact, person } })} />
              <Field label="E-mail" value={content.contact.email} onChange={(emailValue) => setContent({ ...content, contact: { ...content.contact, email: emailValue } })} />
              <Field label="Telefon" value={content.contact.phone} onChange={(phone) => setContent({ ...content, contact: { ...content.contact, phone } })} />
            </div>
          ) : null}

          {section === "footer" ? (
            <div className="flex flex-col gap-6 p-6 sm:p-8" style={goldSurface}>
              <h2 className="font-['Cormorant_Garamond:Regular'] text-[#7a4e38] text-3xl">Patička</h2>
              <Field label="Krátký text u loga" value={content.footer.tagline} onChange={(tagline) => setContent({ ...content, footer: { ...content.footer, tagline } })} multiline />
              <Field label="Jméno provozovatele" value={content.footer.operatorName} onChange={(operatorName) => setContent({ ...content, footer: { ...content.footer, operatorName } })} />
              <Field label="Označení značky" value={content.footer.operatorBrand} onChange={(operatorBrand) => setContent({ ...content, footer: { ...content.footer, operatorBrand } })} />
              <Field label="Právní poznámka" value={content.footer.legalNote} onChange={(legalNote) => setContent({ ...content, footer: { ...content.footer, legalNote } })} multiline />
              <Field label="Copyright" value={content.footer.copyright} onChange={(copyright) => setContent({ ...content, footer: { ...content.footer, copyright } })} />
            </div>
          ) : null}

          {section === "collections" ? (
            <div className="flex flex-col gap-8">
              {content.collections.map((collection, collectionIndex) => (
                <div key={collection.id} className="flex flex-col gap-6 p-6 sm:p-8" style={goldSurface}>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-['Cormorant_Garamond:Regular'] text-[#7a4e38] text-3xl">{collection.name || "Kolekce"}</h2>
                    <label className="flex items-center gap-2 font-['Manrope:SemiBold'] text-[#7a4e38] text-[12px] tracking-[1px] uppercase">
                      <input
                        type="checkbox"
                        checked={collection.published}
                        onChange={(event) => {
                          const collections = content.collections.map((item, index) =>
                            index === collectionIndex ? { ...item, published: event.target.checked } : item,
                          );
                          setContent({ ...content, collections });
                        }}
                      />
                      Zveřejnit
                    </label>
                  </div>
                  <Field
                    label="Název"
                    value={collection.name}
                    onChange={(name) => {
                      const collections = content.collections.map((item, index) =>
                        index === collectionIndex ? { ...item, name } : item,
                      );
                      setContent({ ...content, collections });
                    }}
                  />
                  <Field
                    label="Úvod"
                    value={collection.intro}
                    onChange={(intro) => {
                      const collections = content.collections.map((item, index) =>
                        index === collectionIndex ? { ...item, intro } : item,
                      );
                      setContent({ ...content, collections });
                    }}
                    multiline
                  />
                  {collection.models.map((model, modelIndex) => (
                    <div key={model.id} className="border border-[rgba(122,78,56,0.35)] p-4 flex flex-col gap-4">
                      <p className="font-['Manrope:Bold'] text-[#7a4e38] text-[12px] tracking-[1.5px] uppercase">Model</p>
                      <Field
                        label="Název modelu"
                        value={model.name}
                        onChange={(name) => {
                          const collections = content.collections.map((item, index) => {
                            if (index !== collectionIndex) return item;
                            const models = item.models.map((entry, idx) => (idx === modelIndex ? { ...entry, name } : entry));
                            return { ...item, models };
                          });
                          setContent({ ...content, collections });
                        }}
                      />
                      <Field
                        label="Popis"
                        value={model.description}
                        onChange={(description) => {
                          const collections = content.collections.map((item, index) => {
                            if (index !== collectionIndex) return item;
                            const models = item.models.map((entry, idx) =>
                              idx === modelIndex ? { ...entry, description } : entry,
                            );
                            return { ...item, models };
                          });
                          setContent({ ...content, collections });
                        }}
                        multiline
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}

          {section === "account" ? (
            <form onSubmit={changePassword} className="flex flex-col gap-6 p-6 sm:p-8" style={goldSurface}>
              <h2 className="font-['Cormorant_Garamond:Regular'] text-[#7a4e38] text-3xl">Účet</h2>
              <p className="font-['Manrope:Regular'] text-[#7a4e38] text-[14px] leading-relaxed">
                Přihlašovací e-mail je {user}. Nové heslo můžete nechat poslat z přihlašovací obrazovky, nebo ho tady zadat sami.
              </p>
              <Field label="Současné heslo" value={currentPassword} onChange={setCurrentPassword} type="password" />
              <Field label="Nové heslo" value={newPassword} onChange={setNewPassword} type="password" />
              <button
                type="submit"
                disabled={busy}
                className="bg-[#f50067] px-8 py-4 font-['Manrope:Bold'] text-[#e6d4ae] text-[13px] tracking-[2px] uppercase hover:bg-[#d4005a] disabled:opacity-60"
              >
                Uložit nové heslo
              </button>
            </form>
          ) : null}

          {section !== "account" ? (
            <button
              type="button"
              disabled={busy}
              onClick={saveContent}
              className="self-start bg-[#f50067] px-8 py-4 font-['Manrope:Bold'] text-[#e6d4ae] text-[13px] tracking-[2px] uppercase hover:bg-[#d4005a] disabled:opacity-60"
            >
              {busy ? "Ukládám…" : "Uložit sekci"}
            </button>
          ) : null}

          {error ? <p className="font-['Manrope:Regular'] text-[#f50067] text-[14px]">{error}</p> : null}
          {message ? <p className="font-['Manrope:Regular'] text-[#c3a06b] text-[14px]">{message}</p> : null}
        </div>
      </div>
    </div>
  );
}
