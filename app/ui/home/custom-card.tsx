import Image from "next/image";
import Link from "next/link";

export default function CustomeCard({
  title,
  image_url,
  clasName,
  width = 1000,
  height = 1000,
  link,
}: {
  title: string;
  image_url: string;
  clasName?: string;
  width?: number;
  height?: number;
  link: string;
}) {
  return (
    <Link href={link} className={`relative ${clasName}`}>
      <Image
        src={image_url}
        alt={title}
        width={width}
        height={height}
        className="w-full h-full object-cover rounded-md"
      />
      <h1 className="text-white absolute bottom-0 left-0 text-2xl font-bold">
        {title}
      </h1>
    </Link>
  );
}
