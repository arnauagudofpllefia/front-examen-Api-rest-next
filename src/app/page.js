// Directiva: marca aquest component com a Client Component
// (necessari per usar useState, useEffect i interactivitat al navegador)
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMascotasList, getHealth } from "@/lib/api";

export default function Home() {
  // Guarda la resposta de GET /health (null mentre carrega)
  const [health, setHealth] = useState(null);
  // Nombre total de varietats a l'API (null mentre carrega)
  const [mascotaCount, setMascotaCount] = useState(null);
  // Missatge d'error visible a la UI
  const [error, setError] = useState("");

  // Carrega en paral·lel la salut de l'API i el comptador de varietats
  async function loadOverview() {
    setError("");
    // Promise.allSettled continua encara que una petició falli
    const [healthResult, mascotaResult] = await Promise.allSettled([
      getHealth(),
      getMascotasList(),
    ]);

    if (healthResult.status === "fulfilled") {
      setHealth(healthResult.value);
    }

    if (mascotaResult.status === "fulfilled") {
      // L'API pot retornar l'array directament o dins .data / .mascotas
      const list = Array.isArray(mascotaResult.value)
        ? mascotaResult.value
        : mascotaResult.value?.data || mascotaResult.value?.mascotas || [];
      setMascotaCount(Array.isArray(list) ? list.length : 0);
    } else {
      setError("No s'ha pogut carregar les dades de l'API.");
    }
  }

  // Executa la càrrega inicial en muntar el component
  // setTimeout(0) difereix l'execució fins al pròxim tick (evita SSR issues)
  useEffect(() => {
    const t = setTimeout(loadOverview, 0);
    return () => clearTimeout(t); // cleanup si el component es desmunta
  }, []);

  // true si l'API ha retornat qualsevol camp que indiqui que està activa
  const isOnline = !!(health?.status || health?.estado || health?.ok);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden rounded-3xl border border-white/8 bg-linear-to-br from-[#0c1e3d] via-[#071428] to-[#04101e] p-8 md:p-12 animate-fade-up">
        {/* Orbs decoratius que pulsen (animate-glow) per donar profunditat */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-cyan-500/12 blur-3xl animate-glow pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-blue-600/10 blur-2xl animate-glow [animation-delay:1.5s] pointer-events-none" />

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Panel Principal
          </div>

          {/* Títol principal: "Mascotas REST" porta un gradient animat (shimmer) */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none mb-4">
            Projecte{" "}
            <span
              className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-sky-300 to-blue-400 animate-shimmer"
              style={{ backgroundSize: "200% auto" }}
            >
              Mascotas REST
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-lg mb-7">
            API Express + client Next.js. Llistat, detall i alta interactiva.
          </p>

          {/* Pill d'estat de l'API: verd=online · gris=carregant · vermell=offline */}
          <div
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-700 ${
              isOnline
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                : health === null
                ? "border-slate-600/40 bg-slate-800/40 text-slate-500"
                : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
          >
            {/* Punt parpellejant (animate-ping) visible quan l'API és online */}
            <span className="relative flex h-2 w-2">
              {isOnline && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex h-2 w-2 rounded-full ${
                  isOnline ? "bg-emerald-400" : health === null ? "bg-slate-600" : "bg-red-400"
                }`}
              />
            </span>
            API {isOnline ? "ONLINE" : health === null ? "Connectant..." : "OFFLINE"}
          </div>
        </div>
      </header>

      {/* ── Alerta d'error ──────────────────────────────────────── */}
      {/* Només visible si loadOverview ha detectat un problema de connexió */}
      {error && (
        <div className="animate-bounce-in flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-sm">
          <span className="text-base leading-none mt-0.5">&#9888;</span>
          {error}
        </div>
      )}

      {/* ── Targetes mètriques ──────────────────────────────────── */}
      {/* 3 targetes (health, varietats, endpoint) amb retard escalonat (stagger) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Colleccio", value: mascotaCount === null ? "..." : mascotaCount, sub: "mascotas disponibles", color: "text-cyan-300", delay: "0ms" },
          { label: "Endpoints", value: "3", sub: "GET / GET :id / POST", color: "text-blue-300", delay: "120ms" },
          { label: "Estat", value: isOnline ? "ON" : health === null ? "..." : "OFF", sub: "connexio amb l API", color: isOnline ? "text-emerald-300" : "text-slate-400", delay: "240ms" },
        ].map(({ label, value, sub, color, delay }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-b from-[#0d1e3a] to-[#08131f] p-6 animate-fade-up hover:border-white/[0.14] transition-colors duration-300"
            style={{ animationDelay: delay }}
          >
            <div className="absolute inset-0 bg-linear-to-br from-white/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">{label}</p>
            <p className={`text-4xl font-bold mb-1 tabular-nums ${color}`}>{value}</p>
            <p className="text-slate-500 text-sm">{sub}</p>
          </div>
        ))}
      </div>

      {/* ── Targetes de navegació ───────────────────────────────── */}
      {/* Dos Link grans que porten al llistat i al formulari d'alta */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/mascotas"
          className="group relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#0c1e3d] to-[#071428] p-7 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_50px_rgba(6,182,212,0.12)] hover:-translate-y-1 animate-fade-up [animation-delay:360ms]"
        >
          <div className="absolute inset-0 bg-linear-to-br from-cyan-500/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative">
            <div className="mb-5 w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
              &#128031;
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-cyan-500/60 mb-1">Modul 01</p>
            <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-200">
              Llistat i Detall
            </h2>
            <p className="text-slate-400 text-sm mb-5 leading-relaxed">
              Consulta totes les varietats i accedeix al detall complet per id.
            </p>
            <span className="inline-flex items-center gap-1.5 text-cyan-400 text-sm font-semibold group-hover:gap-3 transition-all duration-200">
              Veure llistat
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </Link>

        <Link
          href="/afegir"
          className="group relative overflow-hidden rounded-2xl border border-white/8 bg-linear-to-br from-[#0c1e3d] to-[#071428] p-7 transition-all duration-300 hover:border-blue-500/40 hover:shadow-[0_0_50px_rgba(59,130,246,0.12)] hover:-translate-y-1 animate-fade-up [animation-delay:480ms]"
        >
          <div className="absolute inset-0 bg-linear-to-br from-blue-500/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          <div className="relative">
            <div className="mb-5 w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
              &#10010;
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500/60 mb-1">Modul 02</p>
            <h2 className="text-2xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-200">
              Alta Interactiva
            </h2>
            <p className="text-slate-400 text-sm mb-5 leading-relaxed">
              Afegeix una nova varietat via formulari amb POST a l API REST.
            </p>
            <span className="inline-flex items-center gap-1.5 text-blue-400 text-sm font-semibold group-hover:gap-3 transition-all duration-200">
              Obrir formulari
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
