// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://amichalo.gr"),
  title: {
    default: "Alkinoos Michalopoulos — Full Stack & Cloud Engineer",
    template: "%s | Alkinoos Michalopoulos",
  },
  description:
    "Portfolio and projects of Alkinoos Michalopoulos. Full Stack & Cloud Engineer specializing in APIs, cloud infrastructure, and scalable systems.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://amichalo.gr",
    title: "Alkinoos Michalopoulos — Full Stack & Cloud Engineer",
    description:
      "Portfolio and projects of Alkinoos Michalopoulos. Full Stack & Cloud Engineer specializing in APIs, cloud infrastructure, and scalable systems.",
    siteName: "amichalo.gr",
    images: [
      {
        url: "/og.png", 
        width: 1200,
        height: 630,
        alt: "Alkinoos Michalopoulos — Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alkinoos Michalopoulos — Full Stack & Cloud Engineer",
    description:
      "Portfolio and projects of Alkinoos Michalopoulos. Full Stack & Cloud Engineer specializing in APIs, cloud infrastructure, and scalable systems.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#0b0b0c",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>{children}</body>
    </html>
  );
}
