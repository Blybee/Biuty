export const siteConfig = {
  name: "Biuty",
  description:
    "Tu tienda de confianza para suplementos deportivos, productos naturales y estilo de vida saludable.",
  url: "https://biuty.pe",
  ogImage: "https://biuty.pe/og.jpg",
  links: {
    instagram: "https://instagram.com/biuty.pe",
    facebook: "https://facebook.com/biuty.pe",
    whatsapp: "https://wa.me/51999999999",
  },
  contact: {
    email: "contacto@biuty.pe",
    phone: "+51 999 999 999",
    address: "Lima, Perú",
  },
  categories: [
    { id: "suplementos", name: "Suplementos", slug: "suplementos" },
    { id: "naturales", name: "Productos Naturales", slug: "naturales" },
    { id: "fitness", name: "Fitness", slug: "fitness" },
    { id: "bienestar", name: "Bienestar", slug: "bienestar" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
