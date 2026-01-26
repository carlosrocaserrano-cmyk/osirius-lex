# Guía de Despliegue (Deployment)

Esta guía te llevará paso a paso para publicar **Osirius Lex** en internet de forma gratuita.

## 1. Base de Datos (Neon.tech)
1.  Crea una cuenta en [Neon.tech](https://neon.tech).
2.  Crea un nuevo proyecto llamado `osirius-lex`.
3.  Copia la "Connection String" (se ve algo como `postgres://cuervo:...@ep-xyz.aws.neon.tech/neondb?sslmode=require`).
4.  **Importante**: Necesitamos la versión "Pooled" o estándar para producción.

## 2. Almacenamiento (Firebase)
1.  Ve a [Firebase Console](https://console.firebase.google.com/).
2.  Crea un nuevo proyecto llamado `osirius-lex`.
3.  Ve a **Storage** en el menú lateral y haz clic en "Get Started".
    *   Empieza en **Production Mode**.
    *   Selecciona una región cercana (ej. `us-central1`).
4.  Ve a **Project Settings** (el engranaje) -> **General**.
5.  Baja hasta "Your apps" y haz clic en el icono web `</>`.
6.  Registra la app y copia los valores del objeto `firebaseConfig` (apiKey, authDomain, etc). Los necesitarás para Vercel.
7.  Ve a **Project Settings** -> **Service Accounts**.
8.  Haz clic en **Generate new private key**. Esto descargará un archivo JSON. Guárdalo bien; contiene credenciales secretas (`client_email`, `private_key`).

## 3. Código (GitHub)
1.  Crea una cuenta en [GitHub.com](https://github.com).
2.  Crea un **Nuevo Repositorio** (público o privado) llamado `osirius-lex`.
3.  No inicialices con README ni .gitignore (ya los tenemos).
4.  Sigue las instrucciones para "Push an existing repository":
    ```bash
    git add .
    git commit -m "Deployment v1"
    git remote add origin https://github.com/TU_USUARIO/osirius-lex.git
    git branch -M main
    git push -u origin main
    ```

## 4. Hosting (Vercel)
1.  Crea una cuenta en [Vercel.com](https://vercel.com).
2.  Haz clic en **"Add New..."** -> **"Project"**.
3.  Importa tu repositoio de GitHub (`osirius-lex`).
4.  En la configuración del proyecto ("Configure Project"):
    *   **Environment Variables**: Añade las siguientes variables:
        *   `DATABASE_URL`: (Tu URL de Neon)
        *   `NEXT_PUBLIC_FIREBASE_API_KEY`: (De Firebase General Settings)
        *   `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: (De Firebase General Settings)
        *   `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: (De Firebase General Settings)
        *   `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: (De Firebase General Settings)
        *   `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: (De Firebase General Settings)
        *   `NEXT_PUBLIC_FIREBASE_APP_ID`: (De Firebase General Settings)
        *   `FIREBASE_CLIENT_EMAIL`: (Del JSON de Service Account)
        *   `FIREBASE_PRIVATE_KEY`: (Del JSON de Service Account - Copia todo el contenido entre las comillas)
        *   `FIREBASE_PROJECT_ID`: (Del JSON de Service Account)
5.  Haz clic en **"Deploy"**.

## 4. Finalización
*   Vercel construirá tu aplicación.
*   Una vez termine, te dará una URL (ej. `osirius-lex.vercel.app`).
*   ¡Listo! Tu sistema está online.

## Comandos Útiles
*   Si cambias el esquema de la base de datos, ejecuta en tu terminal local:
    ```bash
    npx prisma db push
    ```
    (Asegúrate de que tu `.env` local apunte a Neon para actualizar la base de datos real).
