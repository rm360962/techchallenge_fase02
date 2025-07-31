import express from "express";
import { PostagemController } from "../../controller/postagem.controller.js";
import { validarPermissao, validarToken } from "../../middleware/validacao.js";
import { validarBusca, validarCadastro, validarEdicao } from './postagem.validation.js';

const router = express.Router();
const controller = new PostagemController();

router.get(
    '/posts',
	validarToken,
	validarPermissao('buscar_postagem'),
	validarBusca(),
    controller.buscarPostagens
);

router.get(
    '/posts/:id',
	validarToken,
	validarPermissao('buscar_postagem'), 
    controller.buscarPostagemPorId
);

router.post(
    '/posts',
	validarToken,
	validarPermissao('cadastrar_postagem'),
    validarCadastro(), 
    controller.criarPostagem
);

router.put(
    '/posts/:id',
	validarToken,
	validarPermissao('editar_postagem'),
    validarEdicao(), 
    controller.editarPostagem
);

router.delete(
    '/posts/:id', 
	validarToken,
	validarPermissao('remover_postagem'),
    controller.removerPostagem
);

export default router;