import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Biuty | Productos Naturales & Fitness",
    template: "%s | Biuty",
  },
  description:
    "Tu tienda de confianza para suplementos deportivos, productos naturales y estilo de vida saludable. Miel, algarrobina, proteínas y más.",
  keywords: [
    "suplementos",
    "fitness",
    "productos naturales",
    "miel",
    "algarrobina",
    "salud",
    "bienestar",
    "proteínas",
  ],
  authors: [{ name: "Biuty" }],
  creator: "Biuty",
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "Biuty",
    title: "Biuty | Productos Naturales & Fitness",
    description:
      "Tu tienda de confianza para suplementos deportivos, productos naturales y estilo de vida saludable.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfairDisplay.variable} ${dmSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
