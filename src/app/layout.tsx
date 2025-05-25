import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from '@/lib/config/site';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    template: `%s | ${siteConfig.siteName}`,
    default: siteConfig.siteName,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords.join(', '),
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  metadataBase: new URL(siteConfig.siteUrl),
  
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/static/img/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: '/static/img/linux-id_logo.png',
  },
  
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.siteName,
    locale: siteConfig.ogLocale,
    type: siteConfig.ogType as 'website',
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.siteName} - ${siteConfig.description}`,
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: siteConfig.siteName,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Analytics */}
        {siteConfig.gaTrackingId && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaTrackingId}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${siteConfig.gaTrackingId}');
                `,
              }}
            />
          </>
        )}
        {siteConfig.plausibleDomain && (
          <script
            defer
            data-domain={siteConfig.plausibleDomain}
            src="https://plausible.io/js/script.js"
          />
        )}
      </head>
      <body className="font-sans antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
