import express from 'express';
import fs from 'node:fs';
import mainRouter from './routes/index.js';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());
const file = fs.readFileSync('src/docs/openapi.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'DevSpark MiniBlog API',
    description: 'RESTful API para la gestión de autores y publicaciones desarrollada con Express y PostgreSQL.',
    version: '1.0.0',
    documentation: 'https://editor.swagger.io/ (o ruta a tu openapi.yaml)',
    health: '/health',
    endpoints: {
      authors: {
        list: 'GET /authors',
        getById: 'GET /authors/:id',
        create: 'POST /authors',
        update: 'PUT /authors/:id',
        delete: 'DELETE /authors/:id'
      },
      posts: {
        list: 'GET /posts',
        getById: 'GET /posts/:id',
        getByAuthor: 'GET /posts/author/:authorId',
        create: 'POST /posts',
        update: 'PUT /posts/:id',
        delete: 'DELETE /posts/:id'
      }
    }
  });
});

// healt check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({
        status: 'Ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// main API routes
app.use('/', mainRouter);
app.use('/', errorHandler)
app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

export default app;