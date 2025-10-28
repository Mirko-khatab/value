import "@/app/ui/global.css";
import { bahnschrift } from "@/app/ui/fonts";
import { ThemeProvider } from "@/app/lib/theme-context";
import { LoadingProvider } from "@/app/lib/loading-context";
import { LanguageProvider } from "@/app/lib/language-context";
import PageLoadAnimation from "@/app/ui/page-load-animation";
import GlobalAudioPlayer from "@/app/ui/global-audio-player";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://valuearch.com"),
  title: {
    default:
      "Value Architecture - Professional Architecture & Engineering Services in Sulaymaniyah",
    template: "%s | Value Architecture",
  },
  description:
    "Value Architecture is a leading engineering and architecture firm in Sulaymaniyah, Kurdistan Region of Iraq. Registered with KEU #308. We provide innovative architectural design, engineering solutions, and construction services.",
  keywords: [
    "architecture",
    "engineering",
    "Sulaymaniyah",
    "Kurdistan",
    "Iraq",
    "Value Architecture",
    "architectural design",
    "construction",
    "engineering services",
    "KEU",
    "building design",
    "interior design",
    "project management",
  ],
  authors: [{ name: "Value Architecture", url: "https://valuearch.com" }],
  creator: "Value Architecture",
  publisher: "Value Architecture",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ar_AR", "ku_IQ"],
    url: "https://valuearch.com",
    siteName: "Value Architecture",
    title:
      "Value Architecture - Professional Architecture & Engineering Services",
    description:
      "Leading engineering and architecture firm in Sulaymaniyah, Kurdistan Region of Iraq. KEU Registered #308.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Value Architecture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Value Architecture - Professional Architecture & Engineering Services",
    description:
      "Leading engineering and architecture firm in Sulaymaniyah, Kurdistan Region of Iraq.",
    images: ["/opengraph-image.png"],
  },
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
  verification: {
    // Add your verification codes when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${bahnschrift.className} antialiased bg-white min-h-screen dark:bg-black text-gray-900 dark:text-gray-100 transition-colors duration-200`}
      >
        <LoadingProvider>
          <PageLoadAnimation />
          <LanguageProvider>
            <ThemeProvider>
              {children}
              <GlobalAudioPlayer />
            </ThemeProvider>
          </LanguageProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
