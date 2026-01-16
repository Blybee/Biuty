import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/shared/ui";
import { formatDate } from "@/shared/lib";
import type { BlogPostListItem, BlogCategory } from "@/entities/blog";
import { Clock, User, ChevronRight } from "lucide-react";

// Mock blog posts
const mockPosts: BlogPostListItem[] = [
  {
    id: "1",
    title: "Los 5 mejores suplementos para ganar masa muscular",
    slug: "mejores-suplementos-masa-muscular",
    excerpt: "Descubre cuáles son los suplementos más efectivos para maximizar tus ganancias musculares y cómo incorporarlos en tu rutina de entrenamiento.",
    featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800",
    category: "fitness",
    author: { id: "1", name: "Carlos Mendoza", avatar: "" },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 2, nanoseconds: 0 },
    readTime: 8,
    views: 1250,
  },
  {
    id: "2",
    title: "Beneficios de la miel de abeja para la salud",
    slug: "beneficios-miel-abeja-salud",
    excerpt: "La miel es mucho más que un endulzante natural. Conoce todos sus beneficios para la salud y cómo aprovecharlos al máximo.",
    featuredImage: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
    category: "nutricion",
    author: { id: "2", name: "María García", avatar: "" },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 5, nanoseconds: 0 },
    readTime: 6,
    views: 890,
  },
  {
    id: "3",
    title: "Rutina de ejercicios en casa para principiantes",
    slug: "rutina-ejercicios-casa-principiantes",
    excerpt: "No necesitas un gimnasio para empezar a entrenar. Te compartimos una rutina completa que puedes hacer desde la comodidad de tu hogar.",
    featuredImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    category: "fitness",
    author: { id: "1", name: "Carlos Mendoza", avatar: "" },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 7, nanoseconds: 0 },
    readTime: 10,
    views: 2100,
  },
  {
    id: "4",
    title: "Algarrobina: El superalimento peruano que debes conocer",
    slug: "algarrobina-superalimento-peruano",
    excerpt: "Conoce todos los beneficios de este increíble producto natural peruano y cómo incorporarlo en tu dieta diaria.",
    featuredImage: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=800",
    category: "nutricion",
    author: { id: "2", name: "María García", avatar: "" },
    publishedAt: { seconds: Date.now() / 1000 - 86400 * 10, nanoseconds: 0 },
    readTime: 5,
    views: 1560,
  },
];

const categories: { value: BlogCategory | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "nutricion", label: "Nutrición" },
  { value: "fitness", label: "Fitness" },
  { value: "bienestar", label: "Bienestar" },
  { value: "recetas", label: "Recetas" },
  { value: "consejos", label: "Consejos" },
];

function BlogCard({ post, featured = false }: { post: BlogPostListItem; featured?: boolean }) {
  return (
    <article
      className={`group bg-white rounded-2xl overflow-hidden card-hover ${
        featured ? "lg:col-span-2 lg:grid lg:grid-cols-2" : ""
      }`}
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`relative block ${featured ? "aspect-[4/3] lg:aspect-auto" : "aspect-video"}`}
      >
        <Image
          src={post.featuredImage}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <Badge
          variant="primary"
          className="absolute top-4 left-4 capitalize"
        >
          {post.category}
        </Badge>
      </Link>

      <div className={`p-6 ${featured ? "flex flex-col justify-center" : ""}`}>
        <div className="flex items-center gap-4 text-sm text-sage mb-3">
          <span className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {post.author.name}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {post.readTime} min
          </span>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3
            className={`font-semibold text-forest group-hover:text-primary transition-colors mb-3 ${
              featured ? "text-2xl" : "text-lg line-clamp-2"
            }`}
          >
            {post.title}
          </h3>
        </Link>

        <p className={`text-sage-dark mb-4 ${featured ? "" : "line-clamp-2"}`}>
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-sage">
            {formatDate(new Date(post.publishedAt!.seconds * 1000))}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            Leer más <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const featuredPost = mockPosts[0];
  const otherPosts = mockPosts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-forest text-white">
        <div className="container-biuty py-16 text-center">
          <Badge variant="primary" className="mb-4">Blog</Badge>
          <h1 className="text-white mb-4">Estilo de Vida Biuty</h1>
          <p className="text-sage-light max-w-2xl mx-auto">
            Descubre artículos sobre nutrición, rutinas de ejercicio, 
            tips de bienestar y mucho más para vivir una vida más saludable.
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white border-b border-sage/10 sticky top-16 md:top-20 z-40">
        <div className="container-biuty py-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Link
                key={cat.value}
                href={cat.value === "all" ? "/blog" : `/blog?category=${cat.value}`}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-sage/10 text-sage-dark hover:bg-primary hover:text-white transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-biuty py-12">
        {/* Featured Post */}
        <div className="mb-12">
          <BlogCard post={featuredPost} featured />
        </div>

        {/* Other Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {otherPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 border-2 border-forest/20 text-forest font-semibold rounded-full hover:border-primary hover:text-primary transition-colors">
            Cargar más artículos
          </button>
        </div>
      </div>
    </div>
  );
}
