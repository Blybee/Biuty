import Link from "next/link";
import { siteConfig } from "@/shared/config";
import { Instagram, Facebook, MessageCircle, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  shop: {
    title: "Tienda",
    links: [
      { label: "Suplementos", href: "/shop?category=suplementos" },
      { label: "Productos Naturales", href: "/shop?category=naturales" },
      { label: "Fitness", href: "/shop?category=fitness" },
      { label: "Bienestar", href: "/shop?category=bienestar" },
      { label: "Novedades", href: "/shop?filter=new" },
    ],
  },
  company: {
    title: "Empresa",
    links: [
      { label: "Sobre Nosotros", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Contacto", href: "/contact" },
      { label: "Trabaja con Nosotros", href: "/careers" },
    ],
  },
  support: {
    title: "Soporte",
    links: [
      { label: "Preguntas Frecuentes", href: "/faq" },
      { label: "Envíos y Entregas", href: "/shipping" },
      { label: "Devoluciones", href: "/returns" },
      { label: "Términos y Condiciones", href: "/terms" },
      { label: "Política de Privacidad", href: "/privacy" },
    ],
  },
};

const socialLinks = [
  { icon: Instagram, href: siteConfig.links.instagram, label: "Instagram" },
  { icon: Facebook, href: siteConfig.links.facebook, label: "Facebook" },
  { icon: MessageCircle, href: siteConfig.links.whatsapp, label: "WhatsApp" },
];

export function Footer() {
  return (
    <footer className="bg-forest text-white">
      {/* Main Footer */}
      <div className="container-biuty py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block text-2xl font-display font-bold mb-4">
              <span className="text-primary">●</span> {siteConfig.name}
            </Link>
            <p className="text-sage-light mb-6 max-w-sm">
              {siteConfig.description}
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sage-light">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
                {siteConfig.contact.email}
              </a>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 hover:text-primary transition-colors"
              >
                <Phone className="w-5 h-5" />
                {siteConfig.contact.phone}
              </a>
              <p className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                {siteConfig.contact.address}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-forest-light rounded-full hover:bg-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-lg mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sage-light hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-forest-light">
        <div className="container-biuty py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-1">
                Únete a nuestra comunidad
              </h4>
              <p className="text-sage-light text-sm">
                Recibe ofertas exclusivas y tips de salud
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 md:w-64 px-4 py-3 bg-forest-light rounded-full text-white placeholder:text-sage/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-hover transition-colors"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-forest-light">
        <div className="container-biuty py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sage-light text-sm">
            <p>© {new Date().getFullYear()} {siteConfig.name}. Todos los derechos reservados.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-primary transition-colors">
                Términos
              </Link>
              <Link href="/privacy" className="hover:text-primary transition-colors">
                Privacidad
              </Link>
              <Link href="/cookies" className="hover:text-primary transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
