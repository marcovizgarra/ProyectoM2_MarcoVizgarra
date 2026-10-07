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