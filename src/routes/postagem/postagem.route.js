import express from "express";
import { PostagemController } from "../../controller/postagem.controller.js";

const router = express.Router();
const controller = new PostagemController();

router.get('/posts', controller.buscarPostagens);
router.get('/posts/search', controller.buscarPostagemPorFiltros);
router.get('/posts/:id', controller.buscarPostagemPorId);;
router.post('/posts', controller.criarPostagem);
router.put('/posts/:id', controller.editarPostagem);
router.delete('/posts/:id', controller.removerPostagem);

export default router;