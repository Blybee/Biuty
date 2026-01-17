import { ProductDetail } from "./product-detail";

// Para build estático con output: export
// Todos los slugs deben estar listados aquí
export async function generateStaticParams() {
  // Slugs de los productos en Firestore
  const slugs = [
    "proteina-whey-premium",
    "miel-abeja-pura", 
    "creatina-monohidratada",
    "algarrobina-natural",
    "pre-workout-extreme",
    "multivitaminico-daily",
    "omega-3-fish-oil",
    "colageno-hidrolizado-premium",
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
