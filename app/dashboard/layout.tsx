import SideNav from "@/app/ui/dashboard/sidenav";
import ThemeToggle from "@/app/ui/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-200">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        {children}
      </div>
    </div>
  );
}
