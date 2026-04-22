"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getBacallaById, updateBacalla } from "@/lib/api";

const FIELDS = [
  { key: "nom",        label: "Nom de la varietat", placeholder: "ex. Bacalla negre del Pacific", type: "input"    },
  { key: "origen",     label: "Origen o regio",      placeholder: "ex. Nova Escocia",              type: "input"    },
  { key: "tipus",      label: "Tipus o presentacio", placeholder: "ex. Assecat i salat",           type: "input"    },
  { key: "descripcio", label: "Descripcio curta",    placeholder: "Peix blanc de carn ferma...",   type: "textarea" },
];

export default function EditarPage({ params }) {
  const router = useRouter();
  const [id, setId] = useState(null);
  const [form, setForm]     = useState({ nom: "", origen: "", tipus: "", descripcio: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const { id: resolvedId } = await params;
      setId(resolvedId);
      try {
        const item = await getBacallaById(resolvedId);
        setForm({
          nom:        item.nom        ?? "",
          origen:     item.origen     ?? "",
          tipus:      item.tipus      ?? "",
          descripcio: item.descripcio ?? "",
        });
      } catch (err) {
        setError(err.message || "No s'ha pogut carregar la varietat.");
      } finally {
        setLoading(false);
      }
    }
    setTimeout(load, 0);
  }, [params]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const payload = {
        nom:        form.nom.trim(),
        origen:     form.origen.trim(),
        tipus:      form.tipus.trim(),
        descripcio: form.descripcio.trim(),
      };

      if (!payload.nom || !payload.origen || !payload.tipus || !payload.descripcio) {
        throw new Error("Has d'omplir tots els camps.");
      }

      await updateBacalla(id, payload);
      setSuccess(true);
      router.push(`/bacalla/${id}`);
      router.refresh();
    } catch (err) {
      setError(err.message || "No s'ha pogut actualitzar la varietat.");
    } finally {
      setSaving(false);
    }
  }

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* ── Capçalera ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#0c1e3d] via-[#071428] to-[#04101e] p-8 animate-fade-up">
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-yellow-500/10 blur-3xl animate-glow pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">
              Editar &middot; #{id}
            </div>
            <h1 className="text-4xl font-bold text-white mb-1">
              Editar Varietat
            </h1>
            <p className="text-slate-400 text-sm">
              Modifica els camps i desa els canvis via PUT a l&apos;API REST.
            </p>
          </div>
          <Link
            href={id ? `/bacalla/${id}` : "/bacalla"}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-200 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Detall
          </Link>
        </div>
      </header>

      {/* ── Alertes ─────────────────────────────────────────────── */}
      {error && (
        <div className="animate-bounce-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {success && (
        <div className="animate-bounce-in flex items-start gap-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-yellow-300 text-sm">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Varietat actualitzada correctament.
        </div>
      )}

      {/* ── Formulari ───────────────────────────────────────────── */}
      {loading ? (
        <div className="rounded-2xl border border-white/8 bg-[#071428] p-10 flex justify-center animate-fade-up">
          <svg className="w-6 h-6 animate-spin text-cyan-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/8 bg-[#071428] p-6 space-y-5 animate-fade-up [animation-delay:160ms]"
        >
          {FIELDS.map(({ key, label, placeholder, type }, i) => (
            <div
              key={key}
              className="space-y-2 animate-fade-up"
              style={{ animationDelay: `${220 + i * 80}ms` }}
            >
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
                {label}
              </label>
              {type === "textarea" ? (
                <textarea
                  rows={4}
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0a1628] text-slate-100 placeholder-slate-600 px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/15 transition-all duration-200 resize-none"
                />
              ) : (
                <input
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => update(key, e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0a1628] text-slate-100 placeholder-slate-600 px-4 py-3 text-sm focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/15 transition-all duration-200"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={saving}
            className="w-full mt-1 px-6 py-3.5 rounded-xl bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-[#020c1b] font-bold text-sm transition-all duration-200 hover:shadow-[0_0_32px_rgba(234,179,8,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Desant...
              </span>
            ) : (
              "Desar canvis →"
            )}
          </button>
        </form>
      )}
    </div>
  );
}
