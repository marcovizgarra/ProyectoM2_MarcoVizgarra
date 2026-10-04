import express from 'express';

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

export default app;