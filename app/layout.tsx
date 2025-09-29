import "@/app/ui/global.css";
import { bahnschrift } from "@/app/ui/fonts";
import { ThemeProvider } from "@/app/lib/theme-context";
import { LoadingProvider } from "@/app/lib/loading-context";
import AppEntrance from "@/app/ui/app-entrance";

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
          <AppEntrance />
          <ThemeProvider>{children}</ThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
