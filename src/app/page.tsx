export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-background via-white to-background-alt">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sage/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container-biuty relative z-10 text-center">
          <span className="inline-block px-4 py-2 mb-6 text-sm font-medium text-sage bg-sage/10 rounded-full">
            Naturaleza & Bienestar
          </span>
          
          <h1 className="mb-6 animate-fade-in">
            <span className="block text-forest">Vive Natural,</span>
            <span className="block text-gradient">Vive Biuty</span>
          </h1>
          
          <p className="max-w-2xl mx-auto mb-10 text-lg text-sage-dark md:text-xl animate-slide-up">
            Descubre nuestra selección premium de suplementos deportivos y 
            productos naturales para potenciar tu salud y bienestar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary rounded-full hover:bg-primary-hover transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 focus-ring"
            >
              Explorar Tienda
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            
            <a
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-forest bg-white border-2 border-forest/10 rounded-full hover:border-primary hover:text-primary transition-all duration-300 focus-ring"
            >
              Blog Biuty
            </a>
          </div>
        </div>
      </section>

      {/* Categorías Destacadas */}
      <section className="section-padding bg-white">
        <div className="container-biuty">
          <div className="text-center mb-16">
            <h2 className="mb-4">Nuestras Categorías</h2>
            <p className="text-sage-dark max-w-2xl mx-auto">
              Productos seleccionados cuidadosamente para tu bienestar integral
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Suplementos", icon: "💪", desc: "Proteínas, vitaminas y más" },
              { name: "Naturales", icon: "🍯", desc: "Miel, algarrobina, superfoods" },
              { name: "Fitness", icon: "🏋️", desc: "Pre-workout, recovery" },
              { name: "Bienestar", icon: "🌿", desc: "Cuidado integral" },
            ].map((category) => (
              <a
                key={category.name}
                href={`/shop?category=${category.name.toLowerCase()}`}
                className="group p-8 bg-background rounded-2xl card-hover text-center"
              >
                <span className="text-5xl mb-4 block">{category.icon}</span>
                <h3 className="text-xl mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sage text-sm">{category.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Valor */}
      <section className="section-padding bg-forest text-white">
        <div className="container-biuty">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { value: "100%", label: "Productos Naturales" },
              { value: "+500", label: "Clientes Satisfechos" },
              { value: "24h", label: "Envío Express" },
            ].map((stat) => (
              <div key={stat.label}>
                <span className="block text-5xl font-display font-bold text-primary mb-2">
                  {stat.value}
                </span>
                <span className="text-sage-light">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="section-padding bg-background">
        <div className="container-biuty text-center">
          <h2 className="mb-6">¿Listo para comenzar tu viaje?</h2>
          <p className="text-sage-dark max-w-xl mx-auto mb-8">
            Únete a nuestra comunidad y recibe consejos de salud, 
            ofertas exclusivas y novedades directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-6 py-4 rounded-full border border-sage/30 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors focus-ring"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="py-8 bg-forest text-white">
        <div className="container-biuty text-center">
          <p className="text-sage-light text-sm">
            © 2026 Biuty. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </main>
  );
}
