import Form from "@/app/ui/quote/form";
import Breadcrumbs from "@/app/ui/quote/breadcrumbs";
import { fetchQuoteById } from "@/app/lib/data";
import { notFound } from "next/navigation";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const quote = await fetchQuoteById(id);

  if (!quote || quote.length === 0) {
    notFound();
  }

  const quoteData = quote[0];

  // Convert to plain object to ensure proper serialization
  const serializedQuote = {
    id: quoteData.id,
    title_ku: quoteData.title_ku,
    title_ar: quoteData.title_ar,
    title_en: quoteData.title_en,
    description_ku: quoteData.description_ku,
    description_ar: quoteData.description_ar,
    description_en: quoteData.description_en,
  };

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Quotes", href: "/dashboard/quote" },
          {
            label: "Edit Quote",
            href: `/dashboard/quote/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form mode="edit" quote={serializedQuote} />
    </main>
  );
}
