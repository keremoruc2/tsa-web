import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "TSA TWENTE - Turkish Student Association at University of Twente",
  description: "Welcome to the Turkish Student Association at University of Twente. Join our community, attend events, and connect with Turkish culture in the Netherlands.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
    ],
  },
};

export const viewport = {
  themeColor: "#E30A17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-white text-neutral-900`}>
        {children}
      </body>
    </html>
  );
}
