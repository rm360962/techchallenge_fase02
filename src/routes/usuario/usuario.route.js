import express from "express";
import { UsuarioController } from '../../controller/usuario.controller.js';
import { validaToken, validaPermissao } from '../../middleware/validacao.js';

const router = express.Router();
const controller = new UsuarioController();

router.get(
    '/users', 
    validaToken, 
    validaPermissao, 
    controller.buscarUsuarios
);

router.get(
    '/users/login', 
    controller.logarUsuario
);

router.post(
    '/users', 
    validaToken, 
    validaPermissao, 
    controller.cadastrarUsuario
);

router.put(
    '/users/:id', 
    validaToken, 
    validaPermissao, 
    controller.editarUsuario
);

router.delete('/users/:id', 
    validaToken, 
    validaPermissao, 
    controller.removerUsuario
);

export default router;