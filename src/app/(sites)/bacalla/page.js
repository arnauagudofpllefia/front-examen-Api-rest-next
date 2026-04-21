// Component de servidor asíncron: Next.js el renderitza al servidor i envia HTML estàtic
import Link from "next/link";
import { getBacallaList } from "@/lib/api";

export default async function BacallaListPage() {
  // Llista de varietats; s'omple si la petició té èxit
  let items = [];
  // Missatge d'error per mostrar a la UI si la petició falla
  let error = "";

  try {
    const response = await getBacallaList();
    // Normalitza la resposta: l'API pot retornar l'array directament o dins .data / .bacalla
    items = Array.isArray(response)
      ? response
      : response?.data || response?.bacalla || [];
    if (!Array.isArray(items)) items = [];
  } catch (loadError) {
    error = loadError.message || "No s'ha pogut carregar el llistat.";
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* ── Capçalera ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#0c1e3d] via-[#071428] to-[#04101e] p-8 md:p-10 animate-fade-up">
        {/* Orb decoratiu pulsant de fons */}
        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-cyan-500/10 blur-3xl animate-glow pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">
              Bacalla
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
              Llistat de Varietats
            </h1>
            {/* Recompte dinàmic de varietats */}
            <p className="text-slate-400 text-sm">
              {items.length} varietat{items.length !== 1 ? "s" : ""} disponibles
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Inici
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
      {/* Només visible si getBacallaList ha llançat una excepció */}
      {error && (
        <div className="animate-bounce-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ── Taula de varietats ──────────────────────────────────── */}
      <section className="rounded-2xl border border-white/8 bg-[#071428] overflow-hidden animate-fade-up [animation-delay:160ms]">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-130">
            <thead>
              <tr className="border-b border-white/7">
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-500 w-16">ID</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-500">Nom</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-500 hidden sm:table-cell">Origen</th>
                <th className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-widest text-slate-500 hidden md:table-cell">Tipus</th>
                <th className="px-5 py-3.5 text-right text-xs font-bold uppercase tracking-widest text-slate-500 w-24">Detall</th>
              </tr>
            </thead>
            <tbody>
              {/* Cada fila té un retard escalonat: 220ms + 55ms per índex (stagger) */}
              {items.map((item, i) => (
                <tr
                  key={String(item.id)}
                  className="border-b border-white/4 hover:bg-white/3 transition-colors duration-150 animate-fade-up"
                  style={{ animationDelay: `${220 + i * 55}ms` }}
                >
                  <td className="px-5 py-4 text-slate-500 font-mono text-xs">{item.id}</td>
                  <td className="px-5 py-4 text-white font-medium">{item.nom}</td>
                  <td className="px-5 py-4 text-slate-400 hidden sm:table-cell">{item.origen}</td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    {/* El camp "tipus" es mostra com a badge de color cyan */}
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                      {item.tipus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/bacalla/${item.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 text-xs font-medium hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-300 transition-all duration-150"
                    >
                      Veure
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </Link>
                  </td>
                </tr>
              ))}
              {!error && items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-14 text-center text-slate-500">
                    No hi ha varietats disponibles.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
