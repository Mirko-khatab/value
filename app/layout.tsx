import "@/app/ui/global.css";
import { bahnschrift } from "@/app/ui/fonts";
import { ThemeProvider } from "@/app/lib/theme-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${bahnschrift.className} antialiased bg-white min-h-screen dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
