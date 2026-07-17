import type { Metadata } from "next";
import "./globals.css";

// TODO: replace with your product name/description.
export const metadata: Metadata = {
  title: "TU PRODUCTO — descripción corta",
  description: "Descripción para SEO y previews de redes sociales.",
  openGraph: {
    title: "TU PRODUCTO — descripción corta",
    description: "Descripción para SEO y previews de redes sociales.",
    siteName: "TU PRODUCTO",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary",
    title: "TU PRODUCTO — descripción corta",
    description: "Descripción para SEO y previews de redes sociales.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
        <footer className="border-t border-gray-100 bg-white mt-8">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-gray-400">
            <span>© {new Date().getFullYear()} TU PRODUCTO</span>
            <div className="flex gap-4">
              <a href="/terminos" className="hover:text-gray-600">Términos de uso</a>
              <a href="/privacidad" className="hover:text-gray-600">Privacidad</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
