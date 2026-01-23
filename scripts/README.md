# Scripts de Biuty

Esta carpeta contiene scripts utilitarios para la administración de la tienda.

## Requisitos Previos

### 1. Instalar dependencias

```bash
npm install
```

### 2. Obtener clave de servicio de Firebase

El script necesita una clave de servicio de Firebase Admin para poder escribir directamente en Firestore:

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **⚙️ Configuración del proyecto** > **Cuentas de servicio**
4. Haz clic en **"Generar nueva clave privada"**
5. Guarda el archivo descargado como `serviceAccountKey.json` en la **raíz del proyecto** (junto a package.json)

⚠️ **IMPORTANTE**: El archivo `serviceAccountKey.json` ya está en `.gitignore` para no subir credenciales sensibles.

## Scripts Disponibles

### seed-product.ts

Crea 8 productos de ejemplo en Firestore para pruebas y demostración.

**Uso:**

```bash
npm run seed:products
```

**Productos incluidos:**

| Producto | Categoría | Precio |
|----------|-----------|--------|
| Proteína Whey Premium | Suplementos | S/149.90 |
| Miel de Abeja Pura | Naturales | S/35.90 |
| Creatina Monohidratada | Fitness | S/89.90 |
| Algarrobina Natural | Naturales | S/28.90 |
| Pre-Workout Extreme | Fitness | S/119.90 |
| Multivitamínico Daily | Bienestar | S/59.90 |
| Omega 3 Fish Oil | Bienestar | S/79.90 |
| Colágeno Hidrolizado Premium | Bienestar | S/89.90 |

**Cada producto incluye:**
- ✅ Información básica (nombre, descripción, slug, SKU)
- ✅ Precios (actual y anterior para descuentos)
- ✅ Stock y umbral de stock bajo
- ✅ Imágenes de placeholder (Unsplash)
- ✅ Ingredientes y beneficios
- ✅ Modo de uso
- ✅ Tags para búsqueda
- ✅ Flags de destacado/nuevo/más vendido
- ✅ Meta información SEO

### Ejemplo de salida

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌱 BIUTY - Sembrador de Productos
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦 Proyecto: tu-proyecto-firebase
📚 Colección: products
📝 Productos a crear: 8

✅ Creado: Proteína Whey Premium
   ID: abc123xyz
   Categoría: suplementos
   Precio: S/149.90
   Stock: 50 unidades
...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Resumen:
   ✅ Productos creados: 8
   ❌ Errores: 0

🎉 ¡Proceso completado!

🔗 Próximos pasos:
   1. Visita /admin/inventory para ver los productos
   2. Visita /shop para ver la tienda
   3. Puedes editar los productos desde el panel admin
```

## create-admin-user.ts

Crea usuarios administradores con permisos especiales usando Firebase Admin SDK y Custom Claims.

**Uso:**

```bash
npm run create:admin
```

El script te pedirá:
- 📧 **Correo electrónico**: Email del administrador
- 🔑 **Contraseña**: Mínimo 6 caracteres (recomendado 8+)
- 👤 **Nombre completo**: Para el perfil del usuario

**Lo que hace el script:**

1. ✅ Verifica si el usuario ya existe
   - Si existe: Actualiza contraseña y permisos
   - Si no existe: Crea nuevo usuario
2. ✅ Establece **Custom Claims** con `{ role: "admin" }`
3. ✅ Crea/actualiza documento en Firestore con role: "admin"
4. ✅ Activa el estado del usuario como "active"

### Ejemplo de salida

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 BIUTY - Creador de Usuarios Administradores
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 Proyecto: biuty-12345

📧 Correo electrónico del administrador: admin@biuty.com
🔑 Contraseña (mínimo 6 caracteres): ********
👤 Nombre completo del administrador: Juan Administrador

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏳ Procesando...

📝 Creando nuevo usuario...
✅ Usuario creado: abc123xyz
🔐 Estableciendo permisos de administrador...
✅ Custom claims establecidos: { role: 'admin' }
💾 Actualizando documento en Firestore...
✅ Documento de usuario actualizado en Firestore

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 ¡Proceso completado exitosamente!

📊 Resumen:
   👤 Usuario: admin@biuty.com
   🆔 UID: abc123xyz
   👑 Rol: admin
   📝 Tipo: Nuevo usuario

🔗 Próximos pasos:
   1. Inicia sesión con estas credenciales
   2. Ve a /admin para acceder al panel de administración
   3. El usuario deberá cerrar sesión y volver a iniciar para que los claims surtan efecto
```

### ⚠️ Notas Importantes

1. **Reiniciar Sesión**: Si actualizas un usuario que ya está logueado, debe cerrar sesión y volver a iniciar para que los nuevos permisos surtan efecto.

2. **Custom Claims vs Firestore**: 
   - Los **custom claims** se almacenan en el token de autenticación (más rápido y seguro)
   - El rol en **Firestore** es para respaldo y consultas

3. **Seguridad**: 
   - Solo usuarios con custom claims `role: "admin"` pueden acceder a `/admin`
   - Las Firestore Rules verifican tanto claims como documentos

4. **Usuarios Existentes**: Si tienes usuarios admin antiguos en Firestore pero sin custom claims, ejecuta el script para actualizarlos.

5. **Verificar Creación**:
   - Firebase Console → Authentication → Busca el usuario
   - Firestore → Collection `users` → Verifica `role: "admin"`
   - Inicia sesión y ve a `/admin`



Puedes usar `seed-product.ts` como plantilla:

```typescript
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as fs from "fs";

// Cargar clave de servicio
const serviceAccount = JSON.parse(
  fs.readFileSync("serviceAccountKey.json", "utf-8")
);

// Inicializar Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

// Tu lógica aquí...
async function main() {
  const docRef = await db.collection("tu_coleccion").add({
    campo: "valor",
    createdAt: Timestamp.now(),
  });
  console.log("Creado:", docRef.id);
}

main().then(() => process.exit(0));
```

## Notas Importantes

1. **Imágenes de Placeholder**: Los productos usan imágenes de Unsplash. Puedes reemplazarlas desde el panel de administración subiendo tus propias imágenes.

2. **Evitar Duplicados**: Ejecutar el script múltiples veces creará productos duplicados. Elimínalos desde el panel admin si es necesario.

3. **Producción**: Para ambiente de producción, considera:
   - Validaciones adicionales
   - Manejo de errores más robusto
   - Verificación de duplicados por SKU o slug

4. **Seguridad**: 
   - NUNCA subas `serviceAccountKey.json` a tu repositorio
   - Mantén el archivo seguro y no lo compartas
