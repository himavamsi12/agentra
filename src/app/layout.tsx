import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

// Inter stands in for universalSans / universalSansDisplay: its variable optical-size axis
// switches to the tighter display cut automatically at headline sizes.
const sans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: "Agentra",
  keywords: ["AI agent security", "Claude Code", "Cursor", "MCP", "local-first", "open source"],
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Agentra",
    title: site.title,
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.tagline,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f3f1",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" id="top" className={`${sans.variable} ${mono.variable} antialiased`}>
      <body className="min-h-dvh">
        <div aria-hidden="true" className="page-texture" />
        {children}
      </body>
    </html>
  );
}
