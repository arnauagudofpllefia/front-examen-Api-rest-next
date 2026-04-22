// Directiva: marca aquest component com a Client Component
// (necessari per useState i l'enviament del formulari interactiu)
"use client";

import Link from "next/link";
import { useState } from "react";
import { createMascota } from "@/lib/api";

// Estat inicial del formulari; també s'usa per resetejar-lo després d'un POST correcte
const initialForm = { nombre: "", tipo: "", raza: "", foto: "" };

// Definició dels camps del formulari:
// key → clau del payload | type → "input" o "textarea" (renderitza el control adequat)
const FIELDS = [
  { key: "nombre", label: "Nombre",  placeholder: "ex. Wilson",         type: "input"    },
  { key: "tipo",   label: "Tipo",    placeholder: "ex. Perro",          type: "input"    },
  { key: "raza",   label: "Raza",    placeholder: "ex. Fox Terrier",    type: "input"    },
  { key: "foto",   label: "Foto",    placeholder: "URL de la foto",     type: "input"    },
];

export default function AfegirPage() {
  // Valors actuals dels camps del formulari
  const [form, setForm]       = useState(initialForm);
  // true mentre s'espera la resposta del POST (mostra spinner)
  const [saving, setSaving]   = useState(false);
  // Missatge d'error de validació o de l'API
  const [error, setError]     = useState("");
  // Objecte creat per l'API (null fins que el POST té èxit)
  const [created, setCreated] = useState(null);

  // Gestiona l'enviament del formulari:
  // 1. Prevé el reload natiu
  // 2. Valida que tots els camps estiguin omplerts
  // 3. Fa POST a /api/mascotas
  // 4. En cas d'èxit: mostra la resposta i reseteja el formulari
  // 5. En cas d'error: mostra el missatge d'error
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setCreated(null);

    try {
      const payload = {
        nombre: form.nombre.trim(),
        tipo:   form.tipo.trim(),
        raza:   form.raza.trim(),
        foto:   form.foto.trim(),
      };

      // Validació bàsica: els camps obligatoris no poden estar buits
      if (!payload.nombre || !payload.tipo || !payload.raza) {
        throw new Error("Has d'omplir els camps obligatoris.");
      }

      const result = await createMascota(payload);
      setCreated(result);
      // Reseteja el formulari als valors inicials buits
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "No s'ha pogut crear la varietat.");
    } finally {
      // Sempre desactiva l'indicador de càrrega
      setSaving(false);
    }
  }

  // Helper: actualitza un únic camp del formulari mantenint la resta
  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* ── Capçalera ─────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#0c1e3d] via-[#071428] to-[#04101e] p-8 animate-fade-up">
        {/* Orb decoratiu de color verd esmeralda */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-emerald-500/10 blur-3xl animate-glow pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
              Alta
            </div>
            <h1 className="text-4xl font-bold text-white mb-1">
              Afegir Nova Varietat
            </h1>
            <p className="text-slate-400 text-sm">
              Formulari interactiu. Envia POST a l&apos;API REST.
            </p>
          </div>
          <Link
            href="/mascotas"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 text-sm font-medium hover:bg-white/10 hover:text-white transition-all duration-200 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Llistat
          </Link>
        </div>
      </header>

      {/* ── Alertes ─────────────────────────────────────────────── */}
      {/* Alerta d'error (validació o error de l'API) */}
      {error && (
        <div className="animate-bounce-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          {error}
        </div>
      )}

      {/* Alerta d'èxit: apareix amb animate-bounce-in quan el POST ha funcionat */}
      {created && (
        <div className="animate-bounce-in flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300 text-sm">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Varietat creada amb id&nbsp;<strong className="font-bold">{created.id}</strong>.
        </div>
      )}

      {/* ── Formulari ───────────────────────────────────────────── */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-white/8 bg-[#071428] p-6 space-y-5 animate-fade-up [animation-delay:160ms]"
      >
        {/* Renderitza cada camp de FIELDS amb retard escalonat */}
        {FIELDS.map(({ key, label, placeholder, type }, i) => (
          <div
            key={key}
            className="space-y-2 animate-fade-up"
            style={{ animationDelay: `${220 + i * 80}ms` }}
          >
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">
              {label}
            </label>
            {/* Renderitza textarea per al camp de descripció, input per als altres */}
            {type === "textarea" ? (
              <textarea
                rows={4}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0a1628] text-slate-100 placeholder-slate-600 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/15 transition-all duration-200 resize-none"
              />
            ) : (
              <input
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => update(key, e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0a1628] text-slate-100 placeholder-slate-600 px-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/15 transition-all duration-200"
              />
            )}
          </div>
        ))}

        {/* Botó d'enviament: gradient cyan→blue, desactivat mentre saving=true */}
        <button
          type="submit"
          disabled={saving}
          className="w-full mt-1 px-6 py-3.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-[#020c1b] font-bold text-sm transition-all duration-200 hover:shadow-[0_0_32px_rgba(6,182,212,0.35)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none hover:-translate-y-0.5 active:translate-y-0"
        >
          {saving ? (
            // Spinner SVG animat (animate-spin) mentre s'espera la resposta de l'API
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Guardant...
            </span>
          ) : (
            "Crear varietat â†’"
          )}
        </button>
      </form>

      {/* ── Resposta JSON de l'API ──────────────────────────────── */}
      {/* Bloc en cru: apareix un cop el POST ha retornat l'objecte creat */}
      {created && (
        <div className="animate-fade-up">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-2 px-1">
            Resposta de l&apos;API
          </p>
          <pre
            className="rounded-2xl border border-white/6 bg-[#020c1b] p-5 overflow-auto text-xs text-cyan-300 leading-relaxed"
            style={{ fontFamily: "var(--font-mono), monospace" }}
          >
            {JSON.stringify(created, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
