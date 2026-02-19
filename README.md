# GitHub Profile Viewer 🚀

Esta aplicación Full-Stack permite visualizar perfiles y repositorios de GitHub.

## ✨ Características Principales

- **Búsqueda Dual Dinámica:** El usuario puede alternar entre cargar su información personal preconfigurada o buscar cualquier usuario público de GitHub mediante un input de texto.
- **Tema Personalizado (Dark/Light):** Implementación de un modo oscuro ("Modo Elliot / Modo Victor") utilizando Tailwind CSS.
- **Gestión de Errores (Error Handling):** Feedback visual para el usuario si intenta buscar un perfil vacío, si el usuario de GitHub no existe (Error 404), o si hay problemas de credenciales (Error 500).

---

## 🧠 ¿Cómo funciona el código internamente?

### 1. El Frontend (`index.html`)
Está construido con HTML y JavaScript. Su trabajo principal es la recolección de datos y la actualización del DOM:
* **Cabeceras Personalizadas:** Al hacer la petición `fetch` al servidor, el frontend envía dos cabeceras HTTP creadas a medida: `x-use-env` (un booleano que indica el estado del checkbox) y `x-search-username` (el texto a buscar).
* **Inyección Segura:** Las respuestas del servidor se iteran y se inyectan en el DOM creando elementos `<li>` dinámicamente, extrayendo la foto, nombre, enlaces a repositorios y conteo de estrellas.

### 2. El Backend (`index.js`)

Construido sobre Node.js y Express, actúa como un intermediario seguro y optimizado entre el frontend y la API de GitHub:

* **Evasión del Rate Limit (Límite de peticiones):** La API pública de GitHub restringe a 60 peticiones por hora. Para solucionar esto, el backend inyecta *siempre* un Token de Acceso Personal (oculto de forma segura mediante `dotenv`) en la cabecera de `Axios`. Esto eleva el límite a 5,000 peticiones por hora, incluso cuando se buscan perfiles públicos de terceros.

* **Seguridad:** El token jamás se expone al cliente. El frontend solo recibe la data procesada y limpia.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** HTML5, CSS (Tailwind CSS via CDN), Vanilla JavaScript, Lucide Icons.
- **Backend:** Node.js, Express.js.
- **Librerías/Dependencias:** - `axios` (Para peticiones HTTP a la API de GitHub).
  - `cors` (Para permitir la comunicación cruzada entre los puertos del Front y el Back).
  - `dotenv` (Para la gestión segura de variables de entorno).

---

## ⚙️ Instrucciones para ejecutar el proyecto

1. Clona este repositorio en tu máquina local.
2. Abre la terminal en la carpeta raíz del proyecto y ejecuta el siguiente comando para instalar las dependencias del servidor:
   ```bash
   npm install
3. Configurar tu propio archivo `.env`
1. Abre este proyecto en tu editor de código
2. Entra a la carpeta **`back`** (donde se encuentra el archivo `index.js`), crea un archivo completamente nuevo y llámalo exactamente **`.env`** (con el punto al principio).
3. Abre ese archivo `.env` y pega tu propio Token de Acceso de GitHub adentro, exactamente con este formato (sin espacios ni comillas extra)
   GITHUB_TOKEN=aqui_pegas_tu_token_personal
4.
