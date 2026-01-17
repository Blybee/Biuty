/**
 * Script para crear productos de prueba en Firestore
 * 
 * IMPORTANTE: Este script usa Firebase Admin SDK para bypass de reglas de seguridad.
 * Necesitas descargar una clave de servicio desde Firebase Console:
 * 1. Ve a Firebase Console > Configuración del proyecto > Cuentas de servicio
 * 2. Haz clic en "Generar nueva clave privada"
 * 3. Guarda el archivo como 'serviceAccountKey.json' en la raíz del proyecto
 * 
 * Uso: npm run seed:products
 */

import { initializeApp, cert, type ServiceAccount } from "firebase-admin/app";
import { getFirestore, Timestamp, FieldValue } from "firebase-admin/firestore";
import * as path from "path";
import * as fs from "fs";

// Intentar cargar la clave de servicio
const serviceAccountPath = path.resolve(process.cwd(), "serviceAccountKey.json");

if (!fs.existsSync(serviceAccountPath)) {
  console.error("━".repeat(60));
  console.error("❌ ERROR: No se encontró el archivo 'serviceAccountKey.json'");
  console.error("━".repeat(60));
  console.error("\n📋 Pasos para obtener la clave de servicio:\n");
  console.error("1. Ve a la consola de Firebase:");
  console.error("   https://console.firebase.google.com/\n");
  console.error("2. Selecciona tu proyecto\n");
  console.error("3. Ve a: ⚙️ Configuración > Cuentas de servicio\n");
  console.error("4. Haz clic en 'Generar nueva clave privada'\n");
  console.error("5. Guarda el archivo descargado como:");
  console.error(`   ${serviceAccountPath}\n`);
  console.error("6. Ejecuta este script nuevamente:\n");
  console.error("   npm run seed:products\n");
  console.error("━".repeat(60));
  console.error("\n⚠️  IMPORTANTE: Agrega 'serviceAccountKey.json' a tu .gitignore");
  console.error("    para no subir credenciales sensibles a tu repositorio.\n");
  process.exit(1);
}

// Cargar clave de servicio
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8")) as ServiceAccount;

// Inicializar Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Tipos
type ProductCategory = "suplementos" | "naturales" | "fitness" | "bienestar";
type ProductStatus = "active" | "inactive" | "out_of_stock";

interface CreateProductDTO {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  images: string[];
  thumbnail: string;
  ingredients?: string[];
  benefits: string[];
  howToUse?: string;
  tags: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  metaTitle?: string;
  metaDescription?: string;
}

/**
 * Productos de ejemplo para sembrar en la base de datos
 */
const sampleProducts: CreateProductDTO[] = [
  {
    name: "Proteína Whey Premium",
    slug: "proteina-whey-premium",
    description: "Proteína de suero de leche de alta calidad, ideal para la recuperación muscular después del entrenamiento. Contiene 25g de proteína por porción con bajo contenido de grasas y carbohidratos. Fácil digestión y rápida absorción para maximizar tus resultados.",
    shortDescription: "Proteína de suero de alta calidad con 25g por porción",
    category: "suplementos",
    price: 149.90,
    compareAtPrice: 189.90,
    sku: "WHEY-001",
    stock: 50,
    lowStockThreshold: 10,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    ingredients: [
      "Concentrado de proteína de suero",
      "Aislado de proteína de suero",
      "Cacao en polvo",
      "Lecitina de soja",
      "Sucralosa",
    ],
    benefits: [
      "25g de proteína por porción",
      "Bajo en grasas y carbohidratos",
      "Rápida absorción",
      "Ideal para post-entrenamiento",
      "Delicioso sabor",
    ],
    howToUse: "Mezcla 1 scoop (30g) con 250ml de agua o leche. Tomar después del entrenamiento o entre comidas.",
    tags: ["proteina", "whey", "suplemento", "fitness", "ganancia muscular"],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    metaTitle: "Proteína Whey Premium | Biuty",
    metaDescription: "Proteína de suero de alta calidad con 25g por porción. Ideal para recuperación muscular y ganancia de masa.",
  },
  {
    name: "Miel de Abeja Pura",
    slug: "miel-abeja-pura",
    description: "Miel 100% natural de apicultores locales del Perú. Sin aditivos ni conservantes. Rica en antioxidantes y propiedades antibacterianas. Perfecta para endulzar tus bebidas, preparar aderezos o consumir directamente.",
    shortDescription: "Miel 100% natural de apicultores locales",
    category: "naturales",
    price: 35.90,
    sku: "MIEL-001",
    stock: 100,
    lowStockThreshold: 20,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400",
    ingredients: [
      "Miel de abeja 100% pura",
    ],
    benefits: [
      "100% natural sin aditivos",
      "Rica en antioxidantes",
      "Propiedades antibacterianas",
      "De apicultores locales",
      "Versátil para uso diario",
    ],
    howToUse: "Consumir 1-2 cucharadas diarias. Ideal con té, tostadas, yogurt o directamente.",
    tags: ["miel", "natural", "organico", "endulzante", "saludable"],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    metaTitle: "Miel de Abeja Pura Natural | Biuty",
    metaDescription: "Miel 100% natural de apicultores locales. Sin aditivos, rica en antioxidantes.",
  },
  {
    name: "Creatina Monohidratada",
    slug: "creatina-monohidratada",
    description: "Creatina monohidratada micronizada de la más alta pureza. Aumenta la fuerza, potencia y rendimiento en entrenamientos de alta intensidad. Sin sabor, fácil de mezclar con cualquier bebida.",
    shortDescription: "Creatina pura para mayor rendimiento y fuerza",
    category: "fitness",
    price: 89.90,
    sku: "CREAT-001",
    stock: 30,
    lowStockThreshold: 10,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400",
    ingredients: [
      "Creatina monohidratada micronizada",
    ],
    benefits: [
      "Aumenta la fuerza y potencia",
      "Mejora el rendimiento deportivo",
      "99.9% de pureza",
      "Sin sabor añadido",
      "Fácil de mezclar",
    ],
    howToUse: "Tomar 5g (1 scoop) diarios con agua o tu bebida favorita. Puede tomarse antes o después del entrenamiento.",
    tags: ["creatina", "fuerza", "fitness", "rendimiento", "suplemento"],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    metaTitle: "Creatina Monohidratada Premium | Biuty",
    metaDescription: "Creatina micronizada de alta pureza para aumentar fuerza y rendimiento deportivo.",
  },
  {
    name: "Algarrobina Natural",
    slug: "algarrobina-natural",
    description: "Algarrobina 100% natural, energizante tradicional peruano rico en hierro, calcio y vitaminas del complejo B. Ideal para combatir la anemia y aumentar la energía de forma natural.",
    shortDescription: "Energizante natural rico en hierro y calcio",
    category: "naturales",
    price: 28.90,
    sku: "ALGA-001",
    stock: 75,
    lowStockThreshold: 15,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400",
    ingredients: [
      "Extracto de algarrobo 100% natural",
    ],
    benefits: [
      "Rico en hierro natural",
      "Alto contenido de calcio",
      "Vitaminas del complejo B",
      "Energizante natural",
      "Producto tradicional peruano",
    ],
    howToUse: "Tomar 1-2 cucharadas diarias. Ideal mezclado con leche, batidos o postres.",
    tags: ["algarrobina", "natural", "energizante", "hierro", "peruano"],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    metaTitle: "Algarrobina Natural Peruana | Biuty",
    metaDescription: "Algarrobina 100% natural, rico en hierro y calcio. Energizante tradicional peruano.",
  },
  {
    name: "Pre-Workout Extreme",
    slug: "pre-workout-extreme",
    description: "Fórmula pre-entrenamiento de alta potencia para entrenamientos más intensos y prolongados. Con cafeína, beta-alanina y citrulina para máxima energía, enfoque y bombeo muscular.",
    shortDescription: "Energía explosiva para tus entrenamientos más intensos",
    category: "fitness",
    price: 119.90,
    sku: "PRE-001",
    stock: 25,
    lowStockThreshold: 8,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
    ingredients: [
      "Cafeína anhidra 200mg",
      "Beta-alanina 3.2g",
      "Citrulina malato 6g",
      "Taurina 1g",
      "Vitaminas B6 y B12",
    ],
    benefits: [
      "Energía explosiva",
      "Mayor enfoque mental",
      "Bombeo muscular intenso",
      "Resistencia prolongada",
      "Recuperación acelerada",
    ],
    howToUse: "Mezclar 1 scoop con 300ml de agua fría. Tomar 20-30 minutos antes del entrenamiento. No exceder 1 porción diaria.",
    tags: ["pre-workout", "energia", "fitness", "entrenamiento", "cafeina"],
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: false,
    metaTitle: "Pre-Workout Extreme | Biuty",
    metaDescription: "Pre-entrenamiento de alta potencia con cafeína y beta-alanina para entrenamientos intensos.",
  },
  {
    name: "Multivitamínico Daily",
    slug: "multivitaminico-daily",
    description: "Complejo vitamínico completo con todas las vitaminas y minerales esenciales para el día a día. Fórmula equilibrada para mantener tu salud y vitalidad óptimas.",
    shortDescription: "Complejo vitamínico completo para el día a día",
    category: "bienestar",
    price: 59.90,
    sku: "MULTI-001",
    stock: 60,
    lowStockThreshold: 15,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1550572017-edd951b55104?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400",
    ingredients: [
      "Vitamina A, C, D, E, K",
      "Complejo B completo",
      "Zinc",
      "Magnesio",
      "Hierro",
      "Calcio",
    ],
    benefits: [
      "Fórmula completa",
      "Fortalece el sistema inmune",
      "Aumenta la energía",
      "Mejora la salud ósea",
      "Antioxidante",
    ],
    howToUse: "Tomar 1 cápsula diaria con el desayuno. No exceder la dosis recomendada.",
    tags: ["vitaminas", "salud", "bienestar", "diario", "minerales"],
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    metaTitle: "Multivitamínico Daily Premium | Biuty",
    metaDescription: "Complejo vitamínico completo con vitaminas y minerales esenciales para tu bienestar diario.",
  },
  {
    name: "Omega 3 Fish Oil",
    slug: "omega-3-fish-oil",
    description: "Aceite de pescado de alta concentración con EPA y DHA. Apoya la salud cardiovascular, cerebral y articular. Cápsulas sin olor a pescado para fácil consumo.",
    shortDescription: "Omega 3 de alta concentración EPA y DHA",
    category: "bienestar",
    price: 79.90,
    compareAtPrice: 99.90,
    sku: "OMEGA-001",
    stock: 45,
    lowStockThreshold: 10,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400",
    ingredients: [
      "Aceite de pescado concentrado",
      "EPA 360mg",
      "DHA 240mg",
      "Vitamina E (antioxidante)",
    ],
    benefits: [
      "Salud cardiovascular",
      "Función cerebral óptima",
      "Salud articular",
      "Sin olor a pescado",
      "Alta concentración",
    ],
    howToUse: "Tomar 2 cápsulas diarias con las comidas. Puede tomarse en una sola toma o dividida.",
    tags: ["omega3", "corazon", "cerebro", "salud", "aceite de pescado"],
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: true,
    metaTitle: "Omega 3 Fish Oil Premium | Biuty",
    metaDescription: "Aceite de pescado con alta concentración de EPA y DHA para salud cardiovascular y cerebral.",
  },
  {
    name: "Colágeno Hidrolizado Premium",
    slug: "colageno-hidrolizado-premium",
    description: "Colágeno hidrolizado tipo I y III de alta absorción. Mejora la elasticidad de la piel, fortalece el cabello y las uñas, y apoya la salud articular. Sabor neutro.",
    shortDescription: "Colágeno tipo I y III para piel, cabello y articulaciones",
    category: "bienestar",
    price: 89.90,
    sku: "COLA-001",
    stock: 40,
    lowStockThreshold: 10,
    status: "active",
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
    ],
    thumbnail: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400",
    ingredients: [
      "Colágeno hidrolizado tipo I y III",
      "Vitamina C",
      "Biotina",
      "Ácido hialurónico",
    ],
    benefits: [
      "Mejora elasticidad de la piel",
      "Fortalece cabello y uñas",
      "Salud articular",
      "Rápida absorción",
      "Sabor neutro",
    ],
    howToUse: "Mezclar 10g (1 scoop) en agua, jugo o batido. Tomar diariamente, preferiblemente en ayunas.",
    tags: ["colageno", "piel", "belleza", "articulaciones", "anti-edad"],
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    metaTitle: "Colágeno Hidrolizado Premium | Biuty",
    metaDescription: "Colágeno hidrolizado tipo I y III para mejorar piel, cabello, uñas y salud articular.",
  },
];

/**
 * Crea un producto en Firestore
 */
async function createProduct(product: CreateProductDTO): Promise<string> {
  const now = Timestamp.now();
  
  const productData = {
    ...product,
    createdAt: now,
    updatedAt: now,
  };
  
  const docRef = await db.collection("products").add(productData);
  return docRef.id;
}

/**
 * Función principal para sembrar productos
 */
async function seedProducts(): Promise<void> {
  console.log("━".repeat(60));
  console.log("🌱 BIUTY - Sembrador de Productos");
  console.log("━".repeat(60));
  console.log(`\n📦 Proyecto: ${(serviceAccount as Record<string, string>).project_id}`);
  console.log(`📚 Colección: products`);
  console.log(`📝 Productos a crear: ${sampleProducts.length}\n`);
  
  let created = 0;
  let errors = 0;
  
  for (const product of sampleProducts) {
    try {
      const id = await createProduct(product);
      console.log(`✅ Creado: ${product.name}`);
      console.log(`   ID: ${id}`);
      console.log(`   Categoría: ${product.category}`);
      console.log(`   Precio: S/${product.price.toFixed(2)}`);
      console.log(`   Stock: ${product.stock} unidades`);
      console.log("");
      created++;
    } catch (error) {
      console.error(`❌ Error al crear ${product.name}:`, error);
      errors++;
    }
  }
  
  console.log("━".repeat(60));
  console.log(`\n📊 Resumen:`);
  console.log(`   ✅ Productos creados: ${created}`);
  console.log(`   ❌ Errores: ${errors}`);
  console.log(`\n🎉 ¡Proceso completado!`);
  
  if (created > 0) {
    console.log(`\n🔗 Próximos pasos:`);
    console.log(`   1. Visita /admin/inventory para ver los productos`);
    console.log(`   2. Visita /shop para ver la tienda`);
    console.log(`   3. Puedes editar los productos desde el panel admin`);
  }
  
  console.log("\n" + "━".repeat(60) + "\n");
}

// Ejecutar
seedProducts()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error fatal:", error);
    process.exit(1);
  });
