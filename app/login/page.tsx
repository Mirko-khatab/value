import AcmeLogo from "@/app/ui/value-logo";
import LoginForm from "@/app/ui/login-form";
import ThemeToggle from "@/app/ui/theme-toggle";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 dark:bg-blue-600 p-3 md:h-36 transition-colors duration-200">
          <div className="w-32 flex items-center justify-center text-white md:w-36">
            <AcmeLogo />
          </div>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
