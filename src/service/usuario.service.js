import { UsuarioRepository } from "../repository/usuario.repository.js";
import { CategoriaUsuarioRepository } from "../repository/categoria.repository.js";

export class UsuarioService {

    usuarioRepository = new UsuarioRepository();
    categoriaUsuarioRepository = new CategoriaUsuarioRepository();

    async buscar(filtros) {
        try {
            const { resultado: usuarios } = await this.usuarioRepository.buscarUsuarios(filtros);

            return {
                status: 200,
                resposta: filtros.id != null ? [usuarios] : usuarios,
            };
        } catch (erro) {
            console.log('[USUARIO SERVICE] Erro ao buscar o usuario:', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: 'Erro ao buscar os usuario(s)'
                },
            };
        }
    }

    async cadastrar(usuario) {
        try {
            const { possuiResultado: categoriaUsuarioEncontrada } =
                await this.categoriaUsuarioRepository.buscarCategoriasUsuario({
                    id: usuario.categoriaId,
                });

            if (!categoriaUsuarioEncontrada) {
                return {
                    status: 400,
                    resposta: {
                        mensagem: `Categoria ${usuario.categoriaId} não encontrada`,
                    },
                };
            }

            const { possuiResultado: emailJaCadastrado } = await this.usuarioRepository.buscarUsuarios({
                email: usuario.email,
                validacaoEmail: true,
            });

            if (emailJaCadastrado) {
                return {
                    status: 400,
                    resposta: {
                        mensagem: `Email: ${usuario.email} já cadastrado no sistema`,
                    },
                };
            }

            const idCadastrado = await this.usuarioRepository.cadastrarUsuario(usuario);

            return {
                status: 201,
                resposta: {
                    id: idCadastrado,
                    mensagem: 'Usuário cadastrado com sucesso',
                },
            }
        } catch (erro) {
            console.log('[USUARIO SERVICE] Erro ao cadastrar um usuario:', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: 'Erro durante a cadastro do usuário'
                }
            };
        }
    }

    async editar(usuario) {
        try {
            const { possuiResultado: usuarioEncontrado } = await this.usuarioRepository.buscarUsuarios({
                id: usuario.id,
            });

            if (!usuarioEncontrado) {
                return {
                    status: 400,
                    resposta: {
                        mensagem: `Usuário não encontrado`,
                    },
                }
            }

            const usuarioEditado = await this.usuarioRepository.editarUsuario(usuario);

            return {
                status: usuarioEditado ? 200 : 500,
                resposta: {
                    mensagem: usuarioEditado ? 'Usuário editado com sucesso' : 'Erro ao editar o usuario',
                },
            };
        } catch (erro) {
            console.log('[USUARIO SERVICE] Erro ao cadastrar um usuario:', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: 'Erro ao editar o usuário'
                },
            };
        }
    }

    async remover(id) {
        try {
            const { possuiResultado: usuarioEncontrado } = await this.usuarioRepository.buscarUsuarios({
                id: id,
            });

            if (!usuarioEncontrado) {
                return {
                    status: 400,
                    resposta: {
                        mensagem: `Usuário não encontrado`,
                    },
                };
            }

            const usuarioRemovido = await this.usuarioRepository.removerUsuario(id);

            return {
                status: usuarioRemovido ? 200 : 500,
                resposta: {
                    mensagem: usuarioRemovido ? 'Usuário removido com sucesso' : 'Erro ao remover o usuario'
                },
            };
        } catch (erro) {
            console.log('[USUARIO SERVICE] Erro ao remover um usuario:', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: 'Erro durante a remoção do usuário',
                },
            };
        }
    }
}