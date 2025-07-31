import { PostagemRepository } from "../repository/postagem.repository.js";
import { UsuarioRepository } from "../repository/usuario.repository.js";

export class PostagemService {

    postagemRepository = new PostagemRepository();
	usuarioRepository = new UsuarioRepository();

	buscar = async (filtros) => {
        try {
			const { resultado: listaPostagens } = await this.postagemRepository.buscarPostagens(filtros);

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
			const { possuiResultado: postagemEncontrada } =
				await this.postagemRepository.buscarPostagens({
					id: postagem.id,
				});

			if (!postagemEncontrada) {
				return {
					status: 400,
					resposta: {
						mensagem: `Postagem ${postagem.id} não foi encontrada`,
					},
				};
			}

			if (postagem.usuarioId) {
				const { possuiResultado: usuarioEncontrado } =
					await this.usuarioRepository.buscarUsuarios({
						id: postagem.usuarioId,
					});
				
				if(!usuarioEncontrado) {
					return {
						status: 400,
						resposta: {
							mensagem: `Usuário ${postagem.usuarioId} não foi encontrado`
						}
					}
				}
			}

            const postagemEditada = await this.postagemRepository.editarPostagem(postagem);

            return {
                status: postagemEditada ? 200 : 500,
                resposta: {
					mensagem: postagemEditada ? 'Postagem editada com sucesso' : 'Erro ao editar a postagem'
				},
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
			const { possuiResultado: postagemEncontrada } = 
				await this.postagemRepository.buscarPostagens({
					id: id,
				});
			
			if(!postagemEncontrada) {
				return {
					status: 400,
					resposta: {
						mensagem: `Postagem ${id} não encontrada`,
					},
				};
			}
            const postagemRemovida = await this.postagemRepository.removerPostagem(id);

            return {
                status: postagemRemovida ? 200 : 500,
                resposta: {
					mensagem: postagemRemovida ? 'Postagem removida com sucesso' : 'Erro ao remover a postagem',
				},
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
}