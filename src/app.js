import express from 'express';
import mainRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

// healt check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'Ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// main API routes
app.use('/', mainRouter);
app.use('/', errorHandler)

export default app;