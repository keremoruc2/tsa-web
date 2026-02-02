import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tsatwente.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "TSA TWENTE - Turkish Student Association at University of Twente",
    template: "%s | TSA TWENTE",
  },
  description: "Welcome to the Turkish Student Association at University of Twente. Join our community, attend cultural events, and connect with Turkish culture in Enschede, Netherlands.",
  keywords: [
    "TSA TWENTE",
    "Turkish Student Association",
    "University of Twente",
    "Turkish students Netherlands",
    "Turkish culture Enschede",
    "student association Twente",
    "Turkish community Netherlands",
    "UT Enschede",
    "international students Twente",
    "cultural events Enschede",
  ],
  authors: [{ name: "TSA TWENTE" }],
  creator: "TSA TWENTE",
  publisher: "TSA TWENTE",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TSA TWENTE',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["tr_TR", "nl_NL"],
    url: siteUrl,
    siteName: "TSA TWENTE",
    title: "TSA TWENTE - Turkish Student Association at University of Twente",
    description: "Join the Turkish Student Association at University of Twente. Experience Turkish culture, attend events, and become part of our community in the Netherlands.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "TSA TWENTE - Turkish Student Association",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TSA TWENTE - Turkish Student Association",
    description: "Join the Turkish Student Association at University of Twente. Experience Turkish culture and become part of our community.",
    images: ["/images/og-image.jpg"],
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "education",
};

export const viewport = {
  themeColor: "#E30A17",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-white text-neutral-900`}>
        {children}
      </body>
    </html>
  );
}
