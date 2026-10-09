import type { Metadata } from "next";

export const dynamic = "force-dynamic";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { AppProvider } from "../context/AppContext";
import { ToastProvider } from "../context/ToastContext";
import { SiteSettingsProvider } from "../context/SiteSettingsContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Katalog Bisnis & Inovasi | Sekolah Vokasi Universitas Sebelas Maret",
  description: "Etalase resmi produk teknologi, SaaS, prototipe hardware IoT, robotika, dan jasa pengembangan sistem Sekolah Vokasi Universitas Sebelas Maret (UNS).",
  icons: {
    icon: [
      { url: "/images/brand/logo-sv-uns-official-new.png" },
      { url: "/favicon.ico" },
      { url: "/icon.png" },
    ],
    shortcut: "/images/brand/logo-sv-uns-official-new.png",
    apple: "/images/brand/logo-sv-uns-official-new.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${outfit.variable} ${jakarta.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-[#F8FAFC] text-slate-900 dark:bg-[#07192C] dark:text-white transition-colors duration-200">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  localStorage.removeItem("vokasi_theme");
                  localStorage.removeItem("vokasi_theme_v2");
                  var saved = localStorage.getItem("vokasi_theme_v3");
                  if (saved === "dark") {
                    document.documentElement.classList.add("dark");
                  } else {
                    document.documentElement.classList.remove("dark");
                    localStorage.setItem("vokasi_theme_v3", "light");
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <AppProvider>
          <SiteSettingsProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </SiteSettingsProvider>
        </AppProvider>
      </body>
    </html>
  );
}
