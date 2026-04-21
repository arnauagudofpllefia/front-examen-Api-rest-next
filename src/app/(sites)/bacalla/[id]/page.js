// Component de servidor asíncron per a la ruta /bacalla/[id]
import Link from "next/link";
import { getBacallaById } from "@/lib/api";

export default async function BacallaDetailPage({ params }) {
  // await params és necessari a Next.js 15+ perquè params és ara una Promise
  const { id } = await params;
  // Dades de la varietat (null si la petició falla)
  let item = null;
  // Missatge d'error per mostrar a la UI
  let error = "";

  try {
    item = await getBacallaById(id);
  } catch (loadError) {
    error = loadError.message || "No s'ha pogut carregar el detall de la varietat.";
  }

  // Array de camps a renderitzar a la fitxa:
  // mono=true → font monospace; badge=true → pill de color cyan
  const fields = item
    ? [
        { label: "ID",          value: item.id,         mono: true  },
        { label: "Nom",         value: item.nom                      },
        { label: "Origen",      value: item.origen                   },
        { label: "Tipus",       value: item.tipus,      badge: true  },
        { label: "Descripcio",  value: item.descripcio               },
      ]
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* ── Capçalera ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#0c1e3d] via-[#071428] to-[#04101e] p-8 md:p-10 animate-fade-up">
        {/* Orb decoratiu blau de fons */}
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-blue-500/10 blur-3xl animate-glow pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
              Detall &middot; #{id}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
              {item ? item.nom : `Varietat ${id}`}
            </h1>
            <p className="text-slate-400 text-sm">Fitxa completa de la varietat.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/bacalla"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Llistat
            </Link>
            <Link
              href="/afegir"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#020c1b] text-sm font-bold transition-all duration-200 hover:shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:-translate-y-px"
            >
              + Afegir
            </Link>
          </div>
        </div>
      </header>

      {/* ── Alerta d'error ──────────────────────────────────────── */}
      {/* Visible si getBacallaById ha llançat una excepció */}
      {error && (
        <div className="animate-bounce-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* ── Fitxa de camps ──────────────────────────────────────── */}
      {!error && item && (
        <>
          {/* Cada camp té un retard escalonat: 200ms + 80ms per índex */}
          <div className="space-y-3 animate-fade-up [animation-delay:150ms]">
            {fields.map(({ label, value, mono, badge }, i) => (
              <div
                key={label}
                className="flex items-start gap-5 rounded-2xl border border-white/7 bg-[#071428] p-5 animate-fade-up hover:border-white/12 transition-colors duration-200"
                style={{ animationDelay: `${200 + i * 80}ms` }}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 w-20 shrink-0 pt-0.5">
                  {label}
                </span>
                {/* badge → pill cyan | mono → text monospace petit | default → text normal */}
                {badge ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                    {value}
                  </span>
                ) : (
                  <span
                    className={`text-sm leading-relaxed ${
                      mono ? "font-mono text-slate-400 text-xs" : "text-slate-200"
                    }`}
                  >
                    {value}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Bloc de JSON en cru — útil per depurar o inspeccionar la resposta de l'API */}
          <div className="animate-fade-up [animation-delay:700ms]">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 px-1">
              Raw JSON
            </p>
            <pre className="rounded-2xl border border-white/6 bg-[#020c1b] p-5 overflow-auto text-xs text-cyan-300 leading-relaxed" style={{ fontFamily: "var(--font-mono), monospace" }}>
              {JSON.stringify(item, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
