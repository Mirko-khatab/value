import { bahnschrift } from "@/app/ui/fonts";
import Image from "next/image";
export default function ValueLogo() {
  return (
    <div
      className={`${bahnschrift.className} flex  flex-row items-center leading-none text-white`}
    >
      <Image
        src="/image/value.png"
        alt="value logo"
        width={100}
        height={100}
        className="w-full h-full"
        priority={true}
      />
    </div>
  );
}
