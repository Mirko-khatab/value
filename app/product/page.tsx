import ShowcaseLayout from "@/app/ui/showcase-layout";
import { Space } from "../ui/utils/space";
import CustomeCard from "../ui/home/custom-card";
import { Product } from "@/app/lib/definitions";
import { fetchProducts } from "@/app/lib/data";

// Force dynamic rendering to avoid database connection during build
export const dynamic = "force-dynamic";

export default async function Page(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;

  // Server-side data fetching with proper error handling
  const products = await fetchProducts();

  const filteredProducts = products.filter((product) => {
    if (!searchParams.search) return true;
    const searchTerm = searchParams.search.toLowerCase();
    return (
      product.title_en?.toLowerCase().includes(searchTerm) ||
      product.title_ar?.toLowerCase().includes(searchTerm) ||
      product.title_ku?.toLowerCase().includes(searchTerm)
    );
  });

  const organizeInColumns = (products: Product[]) => {
    const columns: Product[][] = [[], []];

    products.forEach((product, index) => {
      const columnIndex = Math.floor(index / 4) % 2;
      columns[columnIndex].push(product);
    });

    return columns;
  };

  const getCardType = (index: number): number => {
    // Every 4th card starting from index 0 should be type 1
    return index % 4 === 0 ? 1 : 2;
  };

  const organizedProducts = organizeInColumns(filteredProducts);

  return (
    <ShowcaseLayout>
      <Space className="flex flex-col gap-8 page-entrance ">
        <div>
          {/* Search form - server-side rendered */}
          <form method="GET" className="w-full sm:w-1/2">
            <input
              type="text"
              name="search"
              placeholder="Search products..."
              defaultValue={searchParams.search || ""}
              className="w-full rounded-md p-2 border transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </form>
        </div>
      </Space>
      <Space className="flex flex-col sm:flex-row gap-8 justify-start">
        {organizedProducts.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((product, productIndex) => {
              const globalIndex =
                columnIndex * Math.ceil(filteredProducts.length / 2) +
                productIndex;
              return (
                <CustomeCard
                  key={product.id}
                  title={
                    product.title_en || product.title_ar || product.title_ku
                  }
                  image_url={product.gallery_image_url || "/image/2.jpg"}
                  link={`/product/${product.id}`}
                  width={400}
                  height={300}
                />
              );
            })}
          </div>
        ))}
      </Space>
    </ShowcaseLayout>
  );
}
