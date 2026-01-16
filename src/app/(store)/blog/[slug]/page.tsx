import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/shared/ui";
import { formatDate } from "@/shared/lib";
import { Clock, User, ChevronLeft, Share2, Heart, Facebook, Twitter } from "lucide-react";

// Mock blog post detail
const mockPost = {
  id: "1",
  title: "Los 5 mejores suplementos para ganar masa muscular",
  slug: "mejores-suplementos-masa-muscular",
  excerpt: "Descubre cuáles son los suplementos más efectivos para maximizar tus ganancias musculares.",
  content: `
## Introducción

Ganar masa muscular requiere una combinación de entrenamiento adecuado, nutrición óptima y descanso suficiente. Los suplementos pueden ser un gran aliado en este proceso, ayudándote a alcanzar tus objetivos de forma más eficiente.

En este artículo, te presentamos los 5 suplementos más efectivos respaldados por la ciencia para el crecimiento muscular.

## 1. Proteína Whey

La proteína de suero de leche (whey) es el suplemento más popular y por buenas razones. Su alta biodisponibilidad y perfil completo de aminoácidos la hacen ideal para la síntesis de proteínas musculares.

**Beneficios principales:**
- Absorción rápida (ideal post-entrenamiento)
- Alto contenido de BCAAs
- Fácil digestión

**Dosis recomendada:** 20-40g después del entrenamiento

## 2. Creatina Monohidratada

La creatina es uno de los suplementos más estudiados y efectivos para mejorar el rendimiento deportivo y aumentar la masa muscular magra.

**Beneficios principales:**
- Aumenta la fuerza y potencia
- Mejora la recuperación entre series
- Incrementa el volumen muscular

**Dosis recomendada:** 3-5g diarios

## 3. BCAAs (Aminoácidos de Cadena Ramificada)

Los BCAAs (leucina, isoleucina y valina) son aminoácidos esenciales que juegan un papel crucial en la síntesis de proteínas musculares.

**Beneficios principales:**
- Reducen la fatiga muscular
- Aceleran la recuperación
- Previenen el catabolismo muscular

**Dosis recomendada:** 5-10g durante o después del entrenamiento

## 4. Beta-Alanina

Este aminoácido no esencial es el precursor de la carnosina, que ayuda a reducir la acumulación de ácido láctico en los músculos.

**Beneficios principales:**
- Mejora la resistencia muscular
- Retrasa la fatiga
- Aumenta el volumen de entrenamiento

**Dosis recomendada:** 2-5g diarios

## 5. Glutamina

La glutamina es el aminoácido más abundante en el tejido muscular y juega un papel importante en la recuperación y el sistema inmunológico.

**Beneficios principales:**
- Acelera la recuperación muscular
- Fortalece el sistema inmune
- Reduce el dolor muscular post-entrenamiento

**Dosis recomendada:** 5-10g diarios

## Conclusión

Recuerda que los suplementos son eso: un complemento a una dieta equilibrada y un programa de entrenamiento adecuado. No existe una píldora mágica que reemplace el trabajo duro y la constancia.

Antes de iniciar cualquier régimen de suplementación, consulta con un profesional de la salud o un nutricionista deportivo para asegurarte de que sea apropiado para tus necesidades individuales.

¿Tienes alguna pregunta sobre estos suplementos? ¡Déjanos un comentario!
  `,
  featuredImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200",
  category: "fitness",
  author: { 
    id: "1", 
    name: "Carlos Mendoza", 
    avatar: "",
    bio: "Entrenador personal certificado y nutricionista deportivo con más de 10 años de experiencia."
  },
  publishedAt: { seconds: Date.now() / 1000 - 86400 * 2, nanoseconds: 0 },
  readTime: 8,
  views: 1250,
  tags: ["suplementos", "masa muscular", "proteína", "creatina", "fitness"],
};

export default function BlogPostPage() {
  return (
    <article className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px]">
        <Image
          src={mockPost.featuredImage}
          alt={mockPost.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/50 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container-biuty pb-12 text-white">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              Volver al blog
            </Link>
            
            <Badge variant="primary" className="mb-4 capitalize">
              {mockPost.category}
            </Badge>
            
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl max-w-4xl mb-6">
              {mockPost.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {mockPost.author.name}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {mockPost.readTime} min de lectura
              </span>
              <span>
                {formatDate(new Date(mockPost.publishedAt.seconds * 1000))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-biuty py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg prose-sage max-w-none">
              <p className="text-xl text-sage-dark mb-8 font-medium">
                {mockPost.excerpt}
              </p>
              
              <div 
                className="[&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-forest [&>h2]:mt-12 [&>h2]:mb-6 
                           [&>p]:text-sage-dark [&>p]:leading-relaxed [&>p]:mb-6
                           [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:text-sage-dark [&>ul>li]:mb-2
                           [&>strong]:text-forest"
                dangerouslySetInnerHTML={{ 
                  __html: mockPost.content
                    .replace(/## /g, '<h2>')
                    .replace(/\n\n/g, '</h2>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.*)/g, '<li>$1</li>')
                }}
              />
            </div>

            {/* Tags */}
            <div className="mt-12 pt-8 border-t border-sage/10">
              <h3 className="font-semibold mb-4">Etiquetas:</h3>
              <div className="flex flex-wrap gap-2">
                {mockPost.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${tag}`}
                    className="px-3 py-1 bg-sage/10 text-sage-dark rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 pt-8 border-t border-sage/10">
              <h3 className="font-semibold mb-4">Compartir:</h3>
              <div className="flex gap-3">
                <button className="p-3 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-3 bg-[#1DA1F2] text-white rounded-full hover:opacity-90 transition-opacity">
                  <Twitter className="w-5 h-5" />
                </button>
                <button className="p-3 bg-sage/10 text-sage-dark rounded-full hover:bg-sage/20 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Author */}
              <div className="bg-background rounded-2xl p-6">
                <h3 className="font-semibold mb-4">Sobre el autor</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-sage/20 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-sage" />
                  </div>
                  <div>
                    <p className="font-semibold">{mockPost.author.name}</p>
                    <p className="text-sm text-sage">Autor</p>
                  </div>
                </div>
                <p className="text-sm text-sage-dark">{mockPost.author.bio}</p>
              </div>

              {/* Related CTA */}
              <div className="bg-primary rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-2">¿Buscas suplementos?</h3>
                <p className="text-white/90 text-sm mb-4">
                  Descubre nuestra selección de productos de alta calidad.
                </p>
                <Link
                  href="/shop?category=suplementos"
                  className="inline-block bg-white text-primary font-semibold px-6 py-2 rounded-full hover:bg-forest hover:text-white transition-colors"
                >
                  Ver productos
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
