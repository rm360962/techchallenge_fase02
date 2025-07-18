import express from "express";
import { UsuarioController } from '../../controller/usuario.controller.js';

const router = express.Router();
const controller = new UsuarioController();

router.get('/users', controller.buscarUsuarios);
router.get('/users/login', controller.logarUsuario)
router.post('/users', controller.cadastrarUsuario);
router.put('/users/:id', controller.editarUsuario);
router.delete('/users/:id', controller.removerUsuario);

export default router;