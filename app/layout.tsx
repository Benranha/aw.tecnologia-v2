import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "@/components/ui";

const title = "AW Tecnologia · Tudo da sua empresa, num lugar só";
const description =
  "Sistemas, sites e aplicativos sob medida que juntam o que hoje está espalhado em planilhas, cadernos e grupos de WhatsApp. 22 anos em Manaus, desde 2003.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, locale: "pt_BR", type: "website", siteName: "AW Tecnologia" },
  icons: { icon: "/logo-mark.png" },
};

export const viewport: Viewport = { themeColor: "#07080b" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
