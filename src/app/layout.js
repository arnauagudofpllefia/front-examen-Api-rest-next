// Fonts de Google carregades amb next/font per evitar FOUT i optimitzar el CLS
import { Fraunces, Manrope, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Font decorativa per a títols h1–h4 (serifa elegante)
const displayFont = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

// Font d'interfície per al cos del text (sans-serif llegible)
const uiFont = Manrope({
  variable: "--font-ui",
  subsets: ["latin"],
});

// Font monospace per a blocs de codi JSON
const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

// Metadades de la pàgina (títol i descripció per al <head>)
export const metadata = {
  title: "BacallÃ  REST",
  description: "Client Next.js per API REST de bacallÃ  â€” projecte d'examen",
};

// Layout arrel: s'aplica a totes les pàgines de l'aplicació
export default function RootLayout({ children }) {
  return (
    // Les variables CSS de les fonts s'injecten com a classes al <html>
    <html
      lang="ca"
      className={`${displayFont.variable} ${uiFont.variable} ${monoFont.variable}`}
    >
      <body className="min-h-screen antialiased overflow-x-hidden">
        {/* Blobs de fons amb animació flotant — aria-hidden perquè siguin ignorats per lectors de pantalla */}
        <div
          aria-hidden="true"
          className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
        >
          <div className="absolute -top-40 -left-40 w-150 h-150 rounded-full bg-cyan-500/7 blur-[130px] animate-float" />
          <div className="absolute top-1/3 -right-48 w-130 h-130 rounded-full bg-blue-600/6 blur-[110px] animate-float-slow [animation-delay:3.5s]" />
          <div className="absolute -bottom-20 left-1/4 w-100 h-100 rounded-full bg-teal-500/5 blur-[100px] animate-float [animation-delay:6s]" />
        </div>

        {/* Barra de navegació fixa a la part superior amb efecte de vidre esmerilat */}
        <header className="sticky top-0 z-50 border-b border-white/7 bg-[#020c1b]/75 backdrop-blur-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <span className="text-xl leading-none select-none">ðŸŸ</span>
              <span className="text-sm font-bold text-white tracking-tight group-hover:text-cyan-400 transition-colors duration-200">
                BacallÃ  REST
              </span>
            </Link>

            <nav className="flex items-center gap-0.5">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/6 transition-all duration-150"
              >
                Inici
              </Link>
              <Link
                href="/bacalla"
                className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/6 transition-all duration-150"
              >
                Llistat
              </Link>
              <Link
                href="/afegir"
                className="ml-1 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-[#020c1b] transition-all duration-200 hover:shadow-[0_0_24px_rgba(6,182,212,0.45)] hover:-translate-y-px"
              >
                + Afegir
              </Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
