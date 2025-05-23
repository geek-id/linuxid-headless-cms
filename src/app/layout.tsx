import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "LinuxID Headless CMS",
  description: "Modern, SEO-optimized headless CMS built with Next.js. Features blog management, reviews system, cloud storage, and beautiful public website.",
  keywords: "cms, headless cms, nextjs, markdown, blog, seo, cloud storage",
  authors: [{ name: "LinuxID Team" }],
  openGraph: {
    title: "LinuxID Headless CMS",
    description: "Modern, SEO-optimized headless CMS built with Next.js",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinuxID Headless CMS",
    description: "Modern, SEO-optimized headless CMS built with Next.js",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
