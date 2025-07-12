import { PostagemRepository } from "../repository/postagem.repository.js";

export class PostagemService {

    postagemRepository = new PostagemRepository();

    async buscar() {
        try {
            const postagens = await this.postagemRepository.buscarPostagem();
            
            return {
                status: 200,
                dados: postagens,
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao buscar as postagens', erro);

            return {
                status: 500,
                dados: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };

    async buscarPorId(id) {
        try {
            const postagens = await this.postagemRepository.buscarPorFiltros({
                id,
            });

            return {
                status: 200,
                dados: postagens[0],
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao buscar uma postagem', erro);

            return {
                status: 500,
                dados: {
                    mensagem: "Erro durante a busca da postagem",
                }
            };
        }
    };

    async cadastrar(postagem) {
        console.log(postagem);
        try {
            const idCadastrado = await this.postagemRepository.cadastrarPostagem(postagem);

            return {
                status: 201,
                dados: {
                    id: idCadastrado,
                    mensagem: 'Postagem cadastrada com sucesso'
                },
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao cadastrar uma postagem', erro);

            return {
                status: 500,
                dados: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };

    async editar(id, postagem) {
        try {
            const sucesso = await this.postagemRepository.editarPostagem(id, postagem);

            return {
                status: 200,
                dados: postagem,
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao editar uma postagem', erro);

            return {
                status: 500,
                dados: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };

    async remover(id) {
        try {
            const postagens = await this.postagemRepository.removerPostagem(id);

            return {
                status: 200,
                dados: postagens,
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao remover uma postagem', erro);

            return {
                status: 500,
                dados: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };

    async buscarPorFiltros(dadosBusca) {
        try {
            const postagens = await this.postagemRepository.buscarPorFiltros(dadosBusca);

            return {
                status: 200,
                dados: postagens,
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao buscar postagem por filtros', erro);

            return {
                status: 500,
                dados: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };
}