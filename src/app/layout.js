import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Harris's Devportfolio",
  description: "An interactive, OS-style developer portfolio.",
};

// `viewport-fit=cover` lets the layout extend under notches/home indicators so
// our env(safe-area-inset-*) padding can reclaim that space; the dark
// themeColor keeps the mobile browser chrome on-brand.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#1a1a24",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
