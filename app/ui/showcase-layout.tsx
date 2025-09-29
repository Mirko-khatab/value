import Image from "next/image";
import Navigation from "./navigation";
import { Fotter } from "./fotter";

interface ShowcaseLayoutProps {
  children: React.ReactNode;
}

export default function ShowcaseLayout({ children }: ShowcaseLayoutProps) {
  return (
    <div className="min-h-screen flex max-w-[1440px] mx-auto flex-col bg-white dark:bg-black">
      <Navigation />
      {/* <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-[1440px] w-full"> */}
      {children}
      {/* </main> */}
      <Fotter />
    </div>
  );
}
