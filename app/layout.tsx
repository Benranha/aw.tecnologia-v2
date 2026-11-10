import type { Metadata, Viewport } from "next";
import "./globals.css";

const title = "AW Tecnologia · Tudo num lugar só";
const description =
  "A AW desenvolve os sistemas, sites e aplicativos que juntam o que hoje está espalhado. 22 anos em Manaus, desde 2003.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, locale: "pt_BR", type: "website", siteName: "AW Tecnologia" },
  icons: { icon: "/logo-mark.png" },
};

export const viewport: Viewport = { themeColor: "#f5f2ec" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
