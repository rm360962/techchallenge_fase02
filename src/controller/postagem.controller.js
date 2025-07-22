import { PostagemService } from "../service/postagem.service.js";

export class PostagemController {
    
    postagemService = new PostagemService();

    buscarPostagens = async (req, res) => {
        const { status, resposta } = await this.postagemService.buscar();
        return res.status(status).send(resposta);
    };

    buscarPostagemPorId = async (req, res) => {
        console.log('to aqui')
        const id = parseInt(req.params.id, 10);
        const { status, resposta } = await this.postagemService.buscarPorId(id);

        return res.status(status).send(resposta);
    };

    criarPostagem = async (req, res) => {
        const postagem = req.body;
        const { status, resposta } = await this.postagemService.cadastrar(postagem);
        return res.status(status).send(resposta);
    };

    editarPostagem = async (req, res) => {
        const postagem = req.body;
        const id = parseInt(req.params.id, 10);
        const { status, resposta } = await this.postagemService.editar(id, postagem);
        return res.status(status).send(resposta);
    };  

    removerPostagem = async (req, res) => {
        const id = parseInt(req.params.id, 10);
        const { status, resposta } = await this.postagemService.remover(id);
        return res.status(status).send(resposta);
    };

    buscarPostagemPorFiltros = async (req, res) => {
        const filtros = req.query;
        const { status, resposta } = await this.postagemService.buscarPorFiltros(filtros);
        return res.status(status).send(resposta);
    };

};
