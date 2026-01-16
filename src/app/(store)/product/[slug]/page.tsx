import { ProductDetail } from "./product-detail";

// Genera los parámetros estáticos para export
export async function generateStaticParams() {
  // En producción: fetch desde Firebase/API
  const slugs = [
    "proteina-whey-premium",
    "creatina-monohidratada",
    "miel-organica-premium",
    "aceite-coco-virgen",
    "pre-workout-extreme",
    "bcaa-amino-recovery",
    "glutamina-pure",
    "omega-3-fish-oil",
  ];
  return slugs.map((slug) => ({ slug }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <ProductDetail slug={slug} />;
}
