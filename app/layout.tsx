import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { brand } from "@/config/brand";
import { RegisterServiceWorker } from "@/components/pwa/register-sw";
import "./globals.css";
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
export const metadata: Metadata = {
  title: brand.metadata.title,
  description: brand.description,
  applicationName: brand.name,
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: brand.name,
  },
  openGraph: {
    title: brand.metadata.title,
    description: brand.description,
    images: [brand.metadata.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    site: brand.metadata.twitterHandle,
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: brand.metadata.themeColor,
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-ink">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
