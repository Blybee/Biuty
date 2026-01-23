import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as readline from "readline";
import * as fs from "fs";

/**
 * Script para crear usuarios administradores con Firebase Custom Claims
 * 
 * Este script:
 * 1. Crea un nuevo usuario en Firebase Auth (o usa uno existente)
 * 2. Establece custom claims con role: "admin"
 * 3. Crea/actualiza el documento en Firestore con role: "admin"
 */

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔐 BIUTY - Creador de Usuarios Administradores");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

// Verificar que existe el archivo de credenciales
const SERVICE_ACCOUNT_PATH = "./serviceAccountKey.json";
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error("❌ Error: No se encontró el archivo 'serviceAccountKey.json'");
    console.error("\n📝 Pasos para obtenerlo:");
    console.error("   1. Ve a Firebase Console > Configuración del proyecto");
    console.error("   2. Ve a la pestaña 'Cuentas de servicio'");
    console.error("   3. Haz clic en 'Generar nueva clave privada'");
    console.error("   4. Guarda el archivo como 'serviceAccountKey.json' en la raíz del proyecto\n");
    process.exit(1);
}

// Cargar credenciales
const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"));

// Inicializar Firebase Admin
initializeApp({
    credential: cert(serviceAccount),
});

const auth = getAuth();
const db = getFirestore();

// Interfaz para leer input del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/**
 * Función helper para hacer preguntas al usuario
 */
function question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            resolve(answer.trim());
        });
    });
}

/**
 * Valida formato de email
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Valida fortaleza de contraseña
 */
function isValidPassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 6) {
        return { valid: false, message: "La contraseña debe tener al menos 6 caracteres" };
    }
    if (password.length < 8) {
        return { valid: true, message: "⚠️  Advertencia: Se recomienda usar al menos 8 caracteres" };
    }
    return { valid: true };
}

/**
 * Función principal
 */
async function main() {
    try {
        console.log("📋 Proyecto:", serviceAccount.project_id);
        console.log("\n");

        // Solicitar email
        let email = "";
        while (!email) {
            email = await question("📧 Correo electrónico del administrador: ");
            if (!isValidEmail(email)) {
                console.error("❌ Email inválido. Por favor usa un formato válido.\n");
                email = "";
            }
        }

        // Solicitar contraseña
        let password = "";
        while (!password) {
            password = await question("🔑 Contraseña (mínimo 6 caracteres): ");
            const validation = isValidPassword(password);
            if (!validation.valid) {
                console.error(`❌ ${validation.message}\n`);
                password = "";
            } else if (validation.message) {
                console.log(validation.message);
            }
        }

        // Solicitar nombre
        const displayName = await question("👤 Nombre completo del administrador: ");

        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("⏳ Procesando...\n");

        let userRecord;
        let isNewUser = false;

        // Intentar obtener usuario existente
        try {
            userRecord = await auth.getUserByEmail(email);
            console.log(`📌 Usuario existente encontrado: ${userRecord.uid}`);

            // Actualizar contraseña si se proporcionó
            await auth.updateUser(userRecord.uid, {
                password: password,
                displayName: displayName || userRecord.displayName,
            });
            console.log("✅ Contraseña actualizada");

        } catch (error: any) {
            // Si el usuario no existe, crearlo
            if (error.code === "auth/user-not-found") {
                console.log("📝 Creando nuevo usuario...");
                userRecord = await auth.createUser({
                    email: email,
                    password: password,
                    displayName: displayName,
                    emailVerified: false,
                });
                isNewUser = true;
                console.log(`✅ Usuario creado: ${userRecord.uid}`);
            } else {
                throw error;
            }
        }

        // Establecer custom claims
        console.log("🔐 Estableciendo permisos de administrador...");
        await auth.setCustomUserClaims(userRecord.uid, { role: "admin" });
        console.log("✅ Custom claims establecidos: { role: 'admin' }");

        // Crear/actualizar documento en Firestore
        console.log("💾 Actualizando documento en Firestore...");
        const userRef = db.collection("users").doc(userRecord.uid);
        const now = Timestamp.now();

        const userData = {
            email: userRecord.email,
            displayName: displayName || userRecord.displayName || "",
            role: "admin",
            status: "active",
            updatedAt: now,
        };

        // Si es nuevo usuario, agregar campos adicionales
        if (isNewUser) {
            Object.assign(userData, {
                firstName: displayName?.split(" ")[0] || "",
                lastName: displayName?.split(" ").slice(1).join(" ") || "",
                addresses: [],
                preferences: {
                    newsletter: true,
                    notifications: true,
                    language: "es",
                },
                createdAt: now,
            });
        }

        await userRef.set(userData, { merge: true });
        console.log("✅ Documento de usuario actualizado en Firestore");

        console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🎉 ¡Proceso completado exitosamente!\n");
        console.log("📊 Resumen:");
        console.log(`   👤 Usuario: ${email}`);
        console.log(`   🆔 UID: ${userRecord.uid}`);
        console.log(`   👑 Rol: admin`);
        console.log(`   📝 Tipo: ${isNewUser ? "Nuevo usuario" : "Usuario existente actualizado"}`);
        console.log("\n🔗 Próximos pasos:");
        console.log("   1. Inicia sesión con estas credenciales");
        console.log("   2. Ve a /admin para acceder al panel de administración");
        console.log("   3. El usuario deberá cerrar sesión y volver a iniciar para que los claims surtan efecto\n");

    } catch (error: any) {
        console.error("\n❌ Error:", error.message);
        if (error.code) {
            console.error("   Código:", error.code);
        }
        process.exit(1);
    } finally {
        rl.close();
    }
}

// Ejecutar script
main()
    .then(() => {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error fatal:", error);
        process.exit(1);
    });
