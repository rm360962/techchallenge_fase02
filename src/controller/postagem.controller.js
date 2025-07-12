import { PostagemService } from "../service/postagem.service.js";

export class PostagemController {
    
    postagemService = new PostagemService();

    buscarPostagens = async (req, res) => {
        const { status, dados: postagens} = await this.postagemService.buscar();
        return res.status(status).send(postagens);
    };

    buscarPostagemPorId = async (req, res) => {
        const id = parseInt(req.params.id, 10);;
        const { status, dados: postagem } = await this.postagemService.buscarPorId(id);

        return res.status(status).send(postagem);
    };

    criarPostagem = async (req, res) => {
        const dados = req.body;
        const { status, dados: postagem } = await this.postagemService.cadastrar(dados);

        return res.status(status).send(postagem);
    };

    editarPostagem = async (req, res) => {
        const dados = req.body;
        const id = parseInt(req.params.id, 10);

        const { status, dados: postagem } = await this.postagemService.editar(id, dados);

        return res.status(status).send(postagem);
    };  

    removerPostagem = async (req, res) => {
        const id = parseInt(req.params.id, 10);

        const { status, dados: postagemDeletada } = await this.postagemService.remover(id);
        
        return res.status(status).send(postagemDeletada);
    };

    buscarPostagemPorFiltros = async (req, res) => {
        const dados = req.body;

        const { status, dados: postagens } = await this.postagemService.buscarPorFiltros(dados);

        return res.status(status).send(postagens);
    };

};
