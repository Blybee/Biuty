# Biuty - Ecommerce de Productos Naturales & Fitness

![Biuty Logo](./public/images/logo.png)

## 🌿 Descripción

Biuty es una tienda online especializada en productos para la salud con un estilo naturalista. Vendemos suplementos deportivos, productos para el gym y productos naturales como miel, algarrobina, y más.

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Next.js | 15.x | Framework fullstack con App Router |
| Tailwind CSS | 4.x | Estilos CSS-first con `@theme` |
| Firebase | 10.x | Auth, Firestore, Storage |
| TypeScript | 5.x | Tipado estático |
| React | 19.x | Librería UI |
| Zustand | 5.x | Estado global |

## 📁 Arquitectura

Este proyecto utiliza una combinación de **Feature-Sliced Design (FSD)** y **Clean Architecture Lite**:

```
src/
├── app/                    # Next.js App Router (rutas)
│   ├── (store)/           # Rutas de la tienda
│   └── (admin)/           # Rutas del panel admin
├── entities/              # Modelos de dominio puro
├── features/              # Casos de uso y lógica de negocio
├── widgets/               # Componentes UI compuestos
├── infrastructure/        # Implementaciones externas (Firebase)
└── shared/                # Utilidades, UI atómico, config
```

### Reglas de Dependencia

- `app/` → `widgets/`, `features/`, `shared/`
- `widgets/` → `features/`, `entities/`, `shared/`
- `features/` → `entities/`, `infrastructure/`, `shared/`
- `entities/` → `shared/` (solo tipos/utils)
- `infrastructure/` implementa interfaces de `entities/`
- `shared/` no importa de ninguna capa superior

## 🎨 Sistema de Diseño

### Paleta de Colores

| Color | Código | Uso |
|-------|--------|-----|
| Verde Activo (Primary) | `#30E85E` | Botones CTA, estados activos |
| Verde Menta Pálido | `#F2F8F4` | Fondos, separadores |
| Verde Salvia (Sage) | `#87A98F` | Textos secundarios, bordes |
| Verde Bosque Oscuro | `#1A3C34` | Tipografía principal |

### Tipografía

- **Display**: Playfair Display (títulos)
- **Body**: DM Sans (cuerpo de texto)

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/biuty.git
cd biuty

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.local.example .env.local
# Editar .env.local con tus credenciales de Firebase

# Iniciar servidor de desarrollo
npm run dev
```

## 📝 Scripts Disponibles

```bash
npm run dev       # Servidor de desarrollo con Turbopack
npm run build     # Compilar para producción
npm run start     # Iniciar servidor de producción
npm run lint      # Ejecutar linter
npm run format    # Formatear código con Prettier
```

## 🔥 Configuración de Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar Authentication (Email/Password)
3. Crear base de datos en Firestore
4. Habilitar Storage
5. Copiar las credenciales a `.env.local`

## 📄 Páginas

### Tienda (Cliente)

- `/` - Página de inicio
- `/shop` - Catálogo de productos
- `/product/[slug]` - Detalle de producto
- `/cart` - Carrito de compras
- `/checkout` - Proceso de pago
- `/blog` - Blog de estilo de vida
- `/blog/[slug]` - Artículo del blog

### Panel de Administración

- `/admin` - Dashboard
- `/admin/inventory` - Gestión de productos
- `/admin/orders` - Gestión de pedidos

## 🧩 Características

- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras persistente
- ✅ Proceso de checkout en un paso
- ✅ Blog integrado
- ✅ Panel de administración
- ✅ Diseño responsive
- ✅ Animaciones suaves
- ✅ SEO optimizado

## 📦 Estructura de Datos

### Producto

```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: 'suplementos' | 'naturales' | 'fitness' | 'bienestar';
  price: number;
  compareAtPrice?: number;
  stock: number;
  images: string[];
  benefits: string[];
  // ...
}
```

### Pedido

```typescript
interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  // ...
}
```

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

Desarrollado con 💚 por Biuty Team
