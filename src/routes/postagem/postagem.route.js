import express from "express";
import { PostagemController } from "../../controller/postagem.controller.js";
import { validaPermissao, validaToken } from "../../middleware/validacao.js";
import { validarBusca, validarCadastro, validarEdicao } from './postagem.validation.js';

const router = express.Router();
const controller = new PostagemController();

router.get(
    '/posts',
    validaToken,
    controller.buscarPostagens
);

router.get(
    '/posts/search',
    validaToken,
    validarBusca(),
    controller.buscarPostagemPorFiltros
);

router.get(
    '/posts/:id',
    validaToken, 
    controller.buscarPostagemPorId
);

router.post(
    '/posts',
    validaToken,
    validaPermissao,
    validarCadastro(), 
    controller.criarPostagem
);

router.put(
    '/posts/:id',
    validaToken,
    validaPermissao,
    validarEdicao(), 
    controller.editarPostagem
);

router.delete(
    '/posts/:id', 
    validaToken,
    validaPermissao,
    controller.removerPostagem
);

export default router;