import express from 'express';
import homeRouter from './routes/home.route.js';
import postagemRouter from './routes/postagem/postagem.route.js';

const app = express();

app.use('/api', homeRouter);
app.use('/api', postagemRouter);

export default app;
