import Image from "next/image";

export default function CustomeCard({
  title,
  image_url,
  clasName,
  width,
  height,
}: {
  title: string;
  image_url: string;
  clasName?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className={`relative ${clasName}`}>
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
    </div>
  );
}
