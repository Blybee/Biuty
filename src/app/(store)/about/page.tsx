import Image from "next/image";
import Link from "next/link";
import { Button } from "@/shared/ui";
import { Leaf, Heart, Shield, Truck, Award, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sobre Nosotros | Biuty",
  description: "Conoce nuestra historia, misión y valores. En Biuty nos dedicamos a ofrecerte los mejores productos naturales y suplementos para tu bienestar.",
};

const values = [
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Seleccionamos cuidadosamente cada ingrediente para garantizar la máxima pureza y calidad.",
  },
  {
    icon: Shield,
    title: "Calidad Certificada",
    description: "Todos nuestros productos cuentan con certificaciones de calidad y seguridad alimentaria.",
  },
  {
    icon: Heart,
    title: "Bienestar Integral",
    description: "Creemos en un enfoque holístico de la salud que integra cuerpo, mente y espíritu.",
  },
  {
    icon: Truck,
    title: "Envío Rápido",
    description: "Entregamos en todo el país con opciones de envío express y seguimiento en tiempo real.",
  },
  {
    icon: Award,
    title: "Satisfacción Garantizada",
    description: "Si no estás satisfecho, te devolvemos tu dinero. Sin preguntas.",
  },
  {
    icon: Users,
    title: "Comunidad",
    description: "Más de 10,000 clientes confían en nosotros para su bienestar diario.",
  },
];

const team = [
  {
    name: "María García",
    role: "Fundadora & CEO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    name: "Carlos Rodríguez",
    role: "Director de Producto",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    name: "Ana Martínez",
    role: "Nutricionista Jefe",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=800&fit=crop"
          alt="Productos naturales Biuty"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 to-forest/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Nuestra Historia
              </h1>
              <p className="mt-4 text-lg md:text-xl text-white/90">
                Transformando vidas a través de la naturaleza desde 2020
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-semibold uppercase tracking-wider text-sm">
                Nuestra Misión
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold text-forest">
                Hacemos que vivir saludable sea fácil y accesible
              </h2>
              <p className="mt-6 text-sage-dark leading-relaxed">
                En Biuty, creemos que todos merecen acceso a productos naturales de alta calidad. 
                Nuestra misión es seleccionar, curar y entregar los mejores suplementos y productos 
                naturales directamente a tu puerta.
              </p>
              <p className="mt-4 text-sage-dark leading-relaxed">
                Trabajamos directamente con productores locales y certificados para garantizar 
                que cada producto que llega a tus manos cumple con los más altos estándares de 
                calidad y sostenibilidad.
              </p>
              <div className="mt-8 flex gap-8">
                <div>
                  <span className="text-4xl font-bold text-primary">10K+</span>
                  <p className="text-sage text-sm mt-1">Clientes felices</p>
                </div>
                <div>
                  <span className="text-4xl font-bold text-primary">500+</span>
                  <p className="text-sage text-sm mt-1">Productos</p>
                </div>
                <div>
                  <span className="text-4xl font-bold text-primary">50+</span>
                  <p className="text-sage text-sm mt-1">Marcas aliadas</p>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop"
                alt="Equipo Biuty"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Nuestros Valores
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-forest">
              Lo que nos define
            </h2>
            <p className="mt-4 text-sage-dark">
              Estos son los principios que guían cada decisión que tomamos y cada producto que seleccionamos.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-medium transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-forest">
                  {value.title}
                </h3>
                <p className="mt-2 text-sage-dark text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">
              Nuestro Equipo
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-forest">
              Las personas detrás de Biuty
            </h2>
            <p className="mt-4 text-sage-dark">
              Un equipo apasionado por el bienestar y comprometido con tu salud.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-forest">
                  {member.name}
                </h3>
                <p className="text-sage text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            ¿Listo para comenzar tu viaje de bienestar?
          </h2>
          <p className="mt-4 text-white/90 max-w-xl mx-auto">
            Explora nuestra colección de productos naturales y descubre cómo podemos ayudarte a vivir mejor.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop">
              <Button variant="secondary" size="lg">
                Explorar Tienda
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                Leer Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
