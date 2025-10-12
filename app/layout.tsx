import "@/app/ui/global.css";
import { bahnschrift } from "@/app/ui/fonts";
import { ThemeProvider } from "@/app/lib/theme-context";
import { LoadingProvider } from "@/app/lib/loading-context";
import { LanguageProvider } from "@/app/lib/language-context";
import PageLoadAnimation from "@/app/ui/page-load-animation";

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
            <ThemeProvider>{children}</ThemeProvider>
          </LanguageProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
