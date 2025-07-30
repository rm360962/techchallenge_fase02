import bodyParser from 'body-parser';
import express from 'express';

import usuarioCategoriaRouter from './routes/categoriaUsuario/categoriaUsuario.route.js';
import homeRouter from './routes/home.route.js';
import postagemRouter from './routes/postagem/postagem.route.js';
import usuarioRouter from './routes/usuario/usuario.route.js';

const app = express();

app.use(bodyParser.json());
app.use('/api', homeRouter);
app.use('/api', postagemRouter);
app.use('/api', usuarioCategoriaRouter);
app.use('/api', usuarioRouter);

export default app;
