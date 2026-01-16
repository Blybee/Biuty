import Link from "next/link";
import { HeroBanner, ProductGrid } from "@/widgets";
import { Button, Badge } from "@/shared/ui";
import { siteConfig } from "@/shared/config";
import type { ProductListItem } from "@/entities/product";

// Mock data para demostración - en producción vendría de Firebase
const mockProducts: ProductListItem[] = [
  {
    id: "1",
    name: "Proteína Whey Premium",
    slug: "proteina-whey-premium",
    shortDescription: "Proteína de suero de alta calidad con 25g por porción",
    category: "suplementos",
    price: 149.90,
    compareAtPrice: 189.90,
    thumbnail: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    stock: 50,
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "2",
    name: "Miel de Abeja Pura",
    slug: "miel-abeja-pura",
    shortDescription: "Miel 100% natural de apicultores locales",
    category: "naturales",
    price: 35.90,
    thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    stock: 100,
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
  },
  {
    id: "3",
    name: "Creatina Monohidratada",
    slug: "creatina-monohidratada",
    shortDescription: "Creatina pura para mayor rendimiento y fuerza",
    category: "fitness",
    price: 89.90,
    thumbnail: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
    stock: 30,
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
  },
  {
    id: "4",
    name: "Algarrobina Natural",
    slug: "algarrobina-natural",
    shortDescription: "Energizante natural rico en hierro y calcio",
    category: "naturales",
    price: 28.90,
    thumbnail: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400",
    stock: 75,
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
  },
];

const categories = [
  {
    name: "Suplementos",
    icon: "💪",
    desc: "Proteínas, vitaminas y más",
    href: "/shop?category=suplementos",
    color: "bg-primary/10",
  },
  {
    name: "Naturales",
    icon: "🍯",
    desc: "Miel, algarrobina, superfoods",
    href: "/shop?category=naturales",
    color: "bg-sage/20",
  },
  {
    name: "Fitness",
    icon: "🏋️",
    desc: "Pre-workout, recovery",
    href: "/shop?category=fitness",
    color: "bg-forest/10",
  },
  {
    name: "Bienestar",
    icon: "🌿",
    desc: "Cuidado integral",
    href: "/shop?category=bienestar",
    color: "bg-background-alt",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroBanner
        subtitle="Naturaleza & Bienestar"
        title="Vive Natural, Vive Biuty"
        description="Descubre nuestra selección premium de suplementos deportivos y productos naturales para potenciar tu salud y bienestar."
        primaryAction={{ label: "Explorar Tienda", href: "/shop" }}
        secondaryAction={{ label: "Blog Biuty", href: "/blog" }}
        height="lg"
      />

      {/* Categories Section */}
      <section className="section-padding bg-white">
        <div className="container-biuty">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">Categorías</Badge>
            <h2 className="mb-4">Encuentra lo que necesitas</h2>
            <p className="text-sage-dark max-w-2xl mx-auto">
              Productos seleccionados cuidadosamente para tu bienestar integral
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`group p-8 rounded-2xl ${category.color} card-hover text-center`}
              >
                <span className="text-5xl mb-4 block">{category.icon}</span>
                <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sage text-sm">{category.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-background">
        <div className="container-biuty">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <Badge variant="secondary" className="mb-4">Destacados</Badge>
              <h2>Productos Populares</h2>
            </div>
            <Link
              href="/shop"
              className="text-primary font-semibold hover:underline mt-4 md:mt-0"
            >
              Ver todos →
            </Link>
          </div>

          <ProductGrid products={mockProducts} columns={4} />
        </div>
      </section>

      {/* Value Proposition */}
      <section className="section-padding bg-forest text-white">
        <div className="container-biuty">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { value: "100%", label: "Productos Naturales", desc: "Ingredientes de primera calidad" },
              { value: "+500", label: "Clientes Satisfechos", desc: "Confían en nosotros" },
              { value: "24h", label: "Envío Express", desc: "A todo Lima y provincias" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="block text-5xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </span>
                <span className="block text-xl font-semibold mb-1">{stat.label}</span>
                <span className="text-sage-light text-sm">{stat.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section-padding bg-white">
        <div className="container-biuty">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <Badge variant="primary" className="mb-4">Novedades</Badge>
              <h2>Recién Llegados</h2>
            </div>
            <Link
              href="/shop?filter=new"
              className="text-primary font-semibold hover:underline mt-4 md:mt-0"
            >
              Ver todos →
            </Link>
          </div>

          <ProductGrid
            products={mockProducts.filter((p) => p.isNewArrival)}
            columns={4}
          />
        </div>
      </section>

      {/* About / Brand Story */}
      <section className="section-padding bg-background-alt">
        <div className="container-biuty">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Nuestra Historia</Badge>
              <h2 className="mb-6">Más que productos, un estilo de vida</h2>
              <p className="text-sage-dark mb-6">
                En Biuty creemos que el bienestar comienza desde adentro. Por eso,
                seleccionamos cuidadosamente cada producto para asegurar la más
                alta calidad y efectividad.
              </p>
              <p className="text-sage-dark mb-8">
                Nuestro compromiso es acompañarte en tu camino hacia una vida más
                saludable, combinando lo mejor de la naturaleza con la ciencia
                moderna del fitness y la nutrición.
              </p>
              <Button variant="secondary">
                <Link href="/about">Conoce más sobre nosotros</Link>
              </Button>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-sage/30 rounded-2xl" />
              <div className="absolute inset-4 bg-white/90 rounded-xl flex items-center justify-center">
                <span className="text-8xl">🌿</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-primary">
        <div className="container-biuty text-center text-white">
          <h2 className="text-white mb-6">¿Listo para comenzar tu viaje?</h2>
          <p className="max-w-xl mx-auto mb-8 text-white/90">
            Únete a nuestra comunidad y recibe consejos de salud, ofertas
            exclusivas y novedades directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-6 py-4 rounded-full bg-white text-forest placeholder:text-sage focus:outline-none focus:ring-2 focus:ring-forest"
            />
            <Button variant="secondary" className="rounded-full">
              Suscribirse
            </Button>
          </form>
        </div>
      </section>
    </>
  );
}
