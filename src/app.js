import express from 'express';
import homeRouter from './routes/home.route.js';

const app = express();

app.use('/api', homeRouter);

export default app;
