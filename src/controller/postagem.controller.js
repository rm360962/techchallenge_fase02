import { PostagemService } from "../service/postagem.service.js";
import { validationResult } from 'express-validator';
import { mascaraValidacao } from '../util/mascaraValidacao.js';

export class PostagemController {

    postagemService = new PostagemService();

    buscarPostagens = async (req, res) => {
		const errosRequisicao = validationResult(req).formatWith(mascaraValidacao);

        if (!errosRequisicao.isEmpty()) {
            return res.status(422).send({
                erros: errosRequisicao.array({ onlyFirstError: true })
            });
        }
		
		const filtros = req.query;
        const { status, resposta } = await this.postagemService.buscar(filtros);
        return res.status(status).send(resposta);
    };

    buscarPostagemPorId = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const { status, resposta } = await this.postagemService.buscarPorId(id);

        return res.status(status).send(resposta);
    };

    criarPostagem = async (req, res) => {
        const errosRequisicao = validationResult(req).formatWith(mascaraValidacao);

        if (!errosRequisicao.isEmpty()) {
            return res.status(422).send({
                erros: errosRequisicao.array({ onlyFirstError: true })
            });
        }

        const postagem = req.body;
		postagem.usuarioId = req.headers.usuarioEvento.id;
        postagem.usuarioInclusao = req.headers.usuarioEvento.login;

        const { status, resposta } = await this.postagemService.cadastrar(postagem);
        return res.status(status).send(resposta);
    };

    editarPostagem = async (req, res) => {
        const errosRequisicao = validationResult(req).formatWith(mascaraValidacao);

        if (!errosRequisicao.isEmpty()) {
            return res.status(422).send({
                erros: errosRequisicao.array({ onlyFirstError: true })
            });
        }

        const postagem = req.body;
        postagem.id = parseInt(req.params.id, 10);
        postagem.usuarioAlteracao = req.headers.usuarioEvento.login;
        const { status, resposta } = await this.postagemService.editar(postagem);
        return res.status(status).send(resposta);
    };

    removerPostagem = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const { status, resposta } = await this.postagemService.remover(id);
        return res.status(status).send(resposta);
    };
};
