import express from 'express';
import homeRouter from './routes/home.route.js';
import postagemRouter from './routes/postagem/postagem.route.js';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use('/api', homeRouter);
app.use('/api', postagemRouter);

export default app;
