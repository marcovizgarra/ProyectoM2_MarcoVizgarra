# MiniBlog REST API

RESTful API backend desarrollada con **Node.js**, **Express** y **PostgreSQL** (`pg`) para el servicio de publicaciones de la startup DevSpark. Permite la gestión completa (CRUD) de autores y publicaciones con persistencia relacional, validación de esquemas de entrada, pruebas automatizadas de integración y despliegue continuo en la nube.

---

## Enlaces del Proyecto

| Recurso | Descripción | Enlace |
| :--- | :--- | :--- |
| **API en Producción** | Servidor backend desplegado y operativo en Railway | [Visitar Railway API](https://proyectom2marcovizgarra-production.up.railway.app) |
| **Swagger UI** | Interfaz interactiva para explorar y probar la documentación de la API | [Abrir en Swagger Editor](https://editor.swagger.io/?url=https://raw.githubusercontent.com/marcovizgarra/ProyectoM2_MarcoVizgarra/main/src/docs/openapi.yaml) |
| **Contrato OpenAPI** | Especificación técnica de la API en formato OpenAPI 3.0 (YAML / JSON) | [Ver openapi.yaml](https://raw.githubusercontent.com/marcovizgarra/ProyectoM2_MarcoVizgarra/main/src/docs/openapi.yaml) |

---


## Tabla de Contenidos
- [Características Principales](#características-principales)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración Local](#instalación-y-configuración-local)
- [Base de Datos y Scripts](#base-de-datos-y-scripts)
- [Ejecución](#ejecución)
- [Suite de Pruebas](#suite-de-pruebas)
- [Documentación OpenAPI (Swagger)](#documentación-openapi-swagger)
- [Despliegue en Producción (Railway)](#despliegue-en-producción-railway)
- [Endpoints de la API](#endpoints-de-la-api)
- [Registro de Uso de Inteligencia Artificial](#registro-de-uso-de-inteligencia-artificial)

---
## Características Principales

- **Arquitectura en capas limpia:** Separación estricta entre rutas, controladores, servicios y persistencia con consultas SQL parametrizadas.
- **Persistencia nativa:** Uso directo del cliente `pg` (Pool de conexiones) sin ORMs pesados para optimización de recursos y consultas directas.
- **Validación robusta:** Middlewares dedicados para sanitización y control de tipos, parámetros de ruta y cuerpos de petición.
- **Manejo centralizado de errores:** Captura estructurada de violaciones de integridad referencial de PostgreSQL (`23505`, `23503`) y errores de sintaxis.
- **Integración continua y testing:** Pruebas de integración automatizadas con Jest y Supertest (17/17 tests pasando).
- **Contrato OpenAPI 3.0:** Documentación viva e interactiva integrada con Swagger UI.

---

## Arquitectura del Proyecto

El proyecto sigue una estructura modular orientada a capas:

```text
ProyectoM2_MarcoVizgarra
├── package-lock.json          # Bloqueo de versiones exactas del árbol de dependencias
├── package.json               # Manifiesto de scripts de ejecución, metadatos y librerías
├── readme.md                  # Documentación principal del proyecto y guía de despliegue
├── scripts/
│   ├── initDb.js              # Runner para inicializar y poblar la base de datos
│   ├── seed.sql               # Poblado inicial e inserción de datos de prueba (DML)
│   └── setup.sql              # Definición de esquema relacional, restricciones y DDL
├── server.js                  # Punto de entrada HTTP y levantamiento del servidor (listener)
├── src/
│   ├── app.js                 # Inicialización de Express, middlewares y montaje de rutas
│   ├── config/
│   │   └── dbConnect.js       # Configuración y Pool de conexiones a PostgreSQL (pg)
│   ├── controllers/           # Orquestación de peticiones HTTP y respuestas de estado
│   │   ├── authorController.js
│   │   └── postController.js
│   ├── docs/                  # Documentación contractual y anexos del proyecto
│   │   ├── IA_usage.md        # Registro y bitácora técnica del uso de IA
│   │   └── openapi.yaml       # Especificación y contrato de la API en OpenAPI 3.0
│   ├── middlewares/           # Middlewares de aplicación y manejo de errores
│   │   ├── errorHandler.js    # Manejador global centralizado de excepciones y errores
│   │   └── validators/        # Middlewares de validación y sanitización de entrada
│   │       ├── authorValidator.js
│   │       └── postValidator.js
│   ├── routes/                # Enrutadores modulares de la aplicación
│   │   ├── authorRoutes.js
│   │   ├── index.js           # Enrutador centralizado que agrupa todas las rutas
│   │   └── postRoutes.js
│   └── services/              # Reglas de negocio y consultas SQL parametrizadas
│       ├── authorService.js
│       └── postService.js
└── tests/                     # Suite de pruebas automatizadas de integración
    ├── authors.test.js
    ├── health.test.js
    └── posts.test.js

```

---

## Requisitos Previos

* **Node.js:** Versión 20.x o superior.


* **npm:** Versión 9.x o superior.
* **PostgreSQL:** Instancia local o remota activa (v14+).

---

## Instalación y Configuración Local

1. Clonar el repositorio:
```bash
git clone https://github.com/marcovizgarra/ProyectoM2_MarcoVizgarra
cd ProyectoM2_MarcoVizgarra

```


2. Instalar dependencias del proyecto:
```bash
npm install

```


3. Crear el archivo de entorno `.env` a partir de la plantilla:


```bash
cp .env.example .env

```


4. Configurar las variables en `.env`:


```env
PORT=3000
NODE_ENV=development

# Conexión local a PostgreSQL
DB_USER=postgres
DB_PASSWORD=tu_contraseña_local
DB_HOST=localhost
DB_PORT=5432
DB_NAME=miniblog

```



---

## Base de Datos y Scripts

El proyecto cuenta con un script automatizado para la creación de tablas e inserción de datos iniciales:

```bash
npm run db:init

```

Este comando ejecuta secuencialmente:

* `scripts/setup.sql`: Crea las tablas relacionales `authors` y `posts` con claves foráneas e integridad referencial en cascada.


* `scripts/seed.sql`: Limpia tablas mediante `TRUNCATE` y siembra registros iniciales de prueba.



---

## Ejecución

* **Modo desarrollo (con auto-reload y lectura nativa de `.env`):**

```bash
npm run dev

```


* **Modo producción:**
```bash
npm run start

```



El servidor quedará disponible en `http://localhost:3000`.

---

## Suite de Pruebas

Las pruebas de integración evalúan el ciclo completo de la aplicación (Ruta $\rightarrow$ Middleware $\rightarrow$ Controlador $\rightarrow$ Servicio $\rightarrow$ Base de Datos) utilizando **Jest** y **Supertest**:

```bash
npm test

```

> **Nota:** La suite ejecuta 17 pruebas cubriendo casos de éxito (200, 201), respuestas sin contenido (204), validación de parámetros y payloads (400), unicidad/conflictos (409) y recursos inexistentes (404).
> 
> 

---

## Documentación OpenAPI (Swagger)

La API expone su documentación interactiva bajo la especificación OpenAPI 3.0:

* **Interfaz interactiva local:** Navegar a `http://localhost:3000/api-docs` (si está montado `swagger-ui-express`) o importar el archivo `openapi.yaml` directamente en [Swagger Editor](https://editor.swagger.io/).


* **Servidores soportados en el contrato:**

* Local: `http://localhost:3000`

* Producción: `https://proyectom2marcovizgarra-production.up.railway.app`



---

## Despliegue en Producción (Railway)

La aplicación se encuentra desplegada y operativa en la plataforma **Railway**.

* **URL Base Pública:** `https://proyectom2marcovizgarra-production.up.railway.app`
* **Healthcheck:** `https://proyectom2marcovizgarra-production.up.railway.app/health`


### Proceso de despliegue y variables configuradas

1. Se vinculó el repositorio de GitHub al servicio backend en Railway con despliegue automático mediante push.


2. Se aprovisionó una base de datos gestionada PostgreSQL en el mismo entorno.
3. Se vincularon las variables de entorno en el panel del servicio:
* `DATABASE_URL`: Referenciada dinámicamente a la URL de conexión interna de PostgreSQL.


* `NODE_ENV`: Establecida en `production` para activar la conexión SSL segura (`rejectUnauthorized: false`).


* `PORT`: Asignado automáticamente por la infraestructura de red de Railway.




4. La base de datos de producción fue inicializada mediante `npm run db:init` a través de la terminal interactiva del contenedor.

---

## Endpoints de la API

### Health Check

* `GET /health` - Estado y disponibilidad del servicio.



### Autores (`/authors`)

* `GET /authors` - Lista todos los autores.


* `GET /authors/:id` - Obtiene el detalle de un autor por ID.


* `POST /authors` - Registra un nuevo autor (valida nombre no vacío y email único/válido).


* `PUT /authors/:id` - Actualiza parcialmente o totalmente un autor.


* `DELETE /authors/:id` - Elimina un autor y sus posts asociados en cascada.



### Publicaciones (`/posts`)

* `GET /posts` - Lista todas las publicaciones.


* `GET /posts/:id` - Obtiene el detalle de una publicación por ID.


* `GET /posts/author/:authorId` - Obtiene todas las publicaciones asociadas a un autor.


* `POST /posts` - Crea una nueva publicación (valida `title`, `content` y existencia de `author_id`).


* `PUT /posts/:id` - Actualiza una publicación existente.


* `DELETE /posts/:id` - Elimina una publicación por ID.



---

## Registro de Uso de Inteligencia Artificial

Siguiendo las pautas de transparencia del Proyecto Integrador, se utilizó un modelo de IA como asistente técnico de desarrollo y pair programming durante las siguientes etapas:

* **Diseño arquitectónico:** Discusión y estructuración del patrón modular por capas y validación de tipos.

* **Sanitización y middlewares:** Asistencia en la formulación de expresiones regulares de validación y manejo centralizado de códigos de error nativos de PostgreSQL.

* **Resolución de incidencias de despliegue:** Diagnóstico y ajuste de scripts de ejecución para compatibilidad de variables de entorno en contenedores de Railway.
* **Elaboración de pruebas:** Cobertura de casos límite de respuestas HTTP con Supertest y Jest.

- **Documentación y registro detallado:** La bitácora completa de asistencia por IA, desglosada por etapas de desarrollo junto con sus respectivos prompts y capturas de pantalla, se encuentra documentada en [src/docs/IA_usage.md](src/docs/IA_usage.md).
