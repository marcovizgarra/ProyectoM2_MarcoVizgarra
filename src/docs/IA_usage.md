Aquí tienes la versión unificada, consolidada y sin redundancias. Se integraron los dos bloques bajo una única numeración correlativa, se unificaron las explicaciones técnicas, se eliminaron las indicaciones de insertar capturas y se resolvieron las duplicaciones:

---

# Documentación de Uso de IA - Módulo 2 (Backend)

Durante el desarrollo del backend en este módulo, se utilizó Inteligencia Artificial (Gemini) como apoyo técnico principal para el diseño arquitectónico, modelado de persistencia, resolución de incidencias en base de datos, automatización de pruebas y diagnóstico en despliegue. A continuación, se detallan los objetivos, consultas y decisiones técnicas adoptadas.

---

### 1. Modelado de Base de Datos y Diagrama Entidad-Relación (DER)

* **Objetivo:** Resolver el error de tipos en la herramienta `dbdiagram.io` al modelar la relación uno a muchos entre autores (`authors`) y publicaciones (`posts`).
* **Problema y Explicación:** El motor del diagrama fallaba al asignar el tipo `SERIAL` a la clave foránea `authors_id`. La IA aclaró que `SERIAL` es un pseudo-tipo de PostgreSQL reservado para secuencias autoincrementales de Claves Primarias (PK), mientras que una clave foránea debe almacenar un valor numérico estático de referencia.
* **Decisión e Implementación:** Se renombró el campo al singular estándar `author_id` y se definió como `INTEGER` (4 bytes fijos en PostgreSQL), coincidiendo con la capacidad del `SERIAL` referenciado y logrando la compilación limpia del esquema.

---

### 2. Entorno de Desarrollo y Comandos de Terminal (PowerShell)

* **Problema:** Al ejecutar `ni src/controllers/authorController.js, postController.js` para inicializar archivos rápidamente, el primer archivo se creaba en la ruta de destino, pero el segundo se generaba en el directorio raíz.
* **Explicación:** PowerShell evalúa las listas separadas por coma como arreglos independientes; al carecer de ruta prefijada en el segundo elemento, lo resolvía en el directorio actual de ejecución.
* **Decisión e Implementación:** Se implementó una canalización iterativa con *pipeline*:
`'authorController.js', 'postController.js' | ForEach-Object { ni "src/controllers/$_" }`, garantizando la creación limpia de múltiples archivos en la carpeta de destino.

---

### 3. Diseño Arquitectónico y Modularización

* **Objetivo:** Definir una arquitectura desacoplada por capas (*bottom-up*) apta para pruebas de integración.
* **Prompt utilizado:**
> *"Estoy desarrollando una REST API en Node.js y Express con PostgreSQL nativo (`pg`) para un servicio de MiniBlog (entidades authors y posts). ¿Cuál es la mejor arquitectura modular por capas (rutas, controladores, servicios y middlewares de validación) para desacoplar responsabilidades y dejar el proyecto listo para testing de integración?"*


* **Aporte técnico:** Separación estricta del listener HTTP (`server.js`) de la instancia Express (`app.js`), aislamiento de consultas SQL parametrizadas en la capa de servicios (`services/`) y estructuración de validadores de entrada previos a los controladores.

---

### 4. Persistencia y Scripts SQL Idempotentes

* **Objetivo:** Configuración del pool de conexiones y ejecución controlada de scripts DDL y DML.
* **Prompt utilizado:**
> *"Tengo dos entidades relacionadas (authors y posts con relación 1 a N y borrado en cascada). Necesito diseñar el esquema DDL relacional en PostgreSQL y un runner ejecutable en Node.js nativo (`scripts/initDb.js`) que ejecute `setup.sql` y `seed.sql` de forma idempotente con `TRUNCATE ... RESTART IDENTITY` sin colisionar con claves foráneas."*


* **Aporte técnico:** Creación del ejecutable `initDb.js` mediante módulos nativos de Node.js (`fs/promises`, `path`), manejo de borrado en cascada (`CASCADE`) y prevención de errores de sintaxis en sentencias `TRUNCATE`.

---

### 5. Manejo Centralizado de Errores de PostgreSQL

* **Objetivo:** Intercepción de excepciones del motor relacional y formateo de respuestas de error JSON sin exponer detalles internos.
* **Prompt utilizado:**
> *"En Express, ¿cómo implemento un middleware centralizado de manejo de errores (`errorHandler.js`) que intercepte y mapee de forma limpia códigos de error nativos de PostgreSQL como violaciones de unicidad (23505), claves foráneas inexistentes (23503), campos nulos (23502) y sintaxis inválida (22P02) a códigos HTTP 400, 404 y 409?"*


* **Aporte técnico:** Implementación del middleware transversal que traduce los códigos `23505` a `409 Conflict`, `23503`/`22P02`/`23502` a `400 Bad Request` y asigna códigos `500` para errores no controlados.

---

### 6. Pruebas Automatizadas de Integración

* **Objetivo:** Configuración y ejecución de la suite de pruebas automatizadas con Jest y Supertest en ES Modules.
* **Prompt utilizado:**
> *"Necesito diseñar una suite de tests de integración con Jest y Supertest en ES Modules para endpoints REST de posts y authors. ¿Cómo estructuro pruebas para verificar códigos 200, 201, 400 y 404, asegurando el cierre ordenado del pool de PostgreSQL al finalizar la ejecución?"*


* **Aporte técnico:** Inyección de variables de entorno mediante `--env-file=.env` para evitar fallos de autenticación SCRAM en Jest, estandarización de códigos de respuesta en endpoints destructivos (`204 No Content`) y cierre del pool mediante hooks `afterAll`.

---

### 7. Diagnóstico y Despliegue en Railway

* **Objetivo:** Solución del fallo de inicio de contenedor por ausencia de archivo físico `.env` en producción.
* **Prompt utilizado:**
> *"Al desplegar mi backend Node.js en Railway, el build colapsa con el error `node: .env: not found` al ejecutar el script `start`. ¿A qué se debe esto al usar flags `--env-file` en contenedores de producción y cómo configuro `package.json` y `process.loadEnvFile()` para que funcione tanto local como en Railway?"*


* **Aporte técnico:** Reconfiguración de scripts en `package.json` para ejecutar `node server.js` sin flags dependientes de archivo físico en producción, integración de `process.loadEnvFile()` con bloque `try/catch` para entornos locales y vinculación de variables inyectadas dinámicamente (`DATABASE_URL`, `PORT`) en Railway.