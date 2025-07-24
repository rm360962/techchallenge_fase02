import { PostagemRepository } from "../repository/postagem.repository.js";

export class PostagemService {

    postagemRepository = new PostagemRepository();

    buscar = async () => {
        try {
            const { resultado: listaPostagens } = await this.postagemRepository.buscarPostagens({});

            return {
                status: 200,
                resposta: listaPostagens,
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao buscar as postagens', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };

    buscarPorId = async (id) => {
        try {
            const { possuiResultado: encontrouRegistro, resultado: postagem } = await this.postagemRepository.buscarPostagens({
                id: id
            });

            return {
                status: 200,
                resposta: encontrouRegistro ? postagem : {},
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao buscar uma postagem', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: "Erro durante a busca da postagem",
                }
            };
        }
    };

    cadastrar = async (postagem) => {
        try {
            const idCadastrado = await this.postagemRepository.cadastrarPostagem(postagem);

            return {
                status: 201,
                resposta: {
                    id: idCadastrado,
                    mensagem: 'Postagem cadastrada com sucesso'
                },
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao cadastrar uma postagem', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };

    editar = async (postagem) => {
        try {
            const postagemEditada = await this.postagemRepository.editarPostagem(postagem);

            return {
                status: postagemEditada ? 200 : 500,
                resposta: postagemEditada ? 'Postagem editada com sucesso' : 'Erro ao editar a postagem',
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao editar uma postagem', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };

    remover = async (id) => {
        try {
            const postagemRemovida = await this.postagemRepository.removerPostagem(id);

            return {
                status: postagemRemovida ? 200 : 500,
                resposta: postagemRemovida ? 'Postagem removida com sucesso' : 'Erro ao remover a postagem',
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao remover uma postagem', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };

    buscarPorFiltros = async (filtros) => {
        try {
            let { resultado: listaPostagens } = await this.postagemRepository.buscarPostagens(filtros);

            if(filtros.id) {
                listaPostagens = listaPostagens ? [listaPostagens] : [];
            }

            return {    
                status: 200,
                resposta: listaPostagens,
            };
        } catch (erro) {
            console.log('[POSTAGEM SERVICE] Erro ao buscar postagem por filtros', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: "Erro durante a busca das postagens",
                }
            };
        }
    };
}