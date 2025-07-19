import { UsuarioRepository } from "../repository/usuario.repository.js";
import { CategoriaUsuarioRepository } from "../repository/categoria.repository.js";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

export class UsuarioService {

    usuarioRepository = new UsuarioRepository();
    categoriaUsuarioRepository = new CategoriaUsuarioRepository();

    buscar = async (filtros) => {
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

    cadastrar = async (usuario) => {
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
                emailIgual: true,
            });

            if (emailJaCadastrado) {
                return {
                    status: 400,
                    resposta: {
                        mensagem: `Email: ${usuario.email} já cadastrado no sistema`,
                    },
                };
            }

            const hashSenha = await this.encriptarSenha(usuario.senha);
            usuario.senha = hashSenha;

            const idCadastrado = await this.usuarioRepository.cadastrarUsuario(usuario);

            return {
                status: 201,
                resposta: {
                    id: idCadastrado,
                    mensagem: 'Usuário cadastrado com sucesso',
                },
            };
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

    editar = async (usuario) => {
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
                };
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

    remover = async (id) => {
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

    logarUsuario = async (autenticacaoBase64) => {
        try {
            const [email, senha] = Buffer.from(autenticacaoBase64.replace('Basic', ''), 'base64').toString('utf-8').split(':');
            console.log('[USUARIO SERVICE] Tentativa de login e-mail: ', email);

            const { possuiResultado: usuarioEncontrado, resultado: hashSenha }
                = await this.usuarioRepository.buscarSenhaUsuarioPorEmail(email);

            if (!usuarioEncontrado) {
                console.log(`[USUARIO SERVICE] E-mail: ${email} nao foi encontrado`);
                return {
                    status: 401,
                    resposta: {
                        mensagem: 'Usuário ou senha inválidos',
                    },
                };
            }

            const senhaCorreta = await bcryptjs.compare(senha, hashSenha);

            if (!senhaCorreta) {
                console.log(`[USUARIO SERVICE] Senha invalida com e-mail: ${email}`);
                return {
                    status: 401,
                    resposta: {
                        mensagem: 'Usuário ou senha inválidos',
                    },
                };
            }

            const { resultado: usuario } = await this.usuarioRepository.buscarUsuarios({
                email: email,
                emailIgual: true,
            });

            const token = jwt.sign({ 
                id: usuario.id,
                categoria: {
                    id: usuario.categoria.id,
                    nome: usuario.categoria.nome,
                }, 
            }, process.env.JWT_SECRET);

            return {
                status: 200,
                resposta: {
                    token: token,
                    usuario: usuario,
                },
            };
        } catch (erro) {
            console.log('[USUARIO SERVICE] Erro ao logar o usuário', erro);

            return {
                status: 500,
                resposta: {
                    mensagem: 'Erro no servidor, tente novamente mais tarde'
                },
            };
        }
    }

    encriptarSenha = async (senha) => {
        return new Promise((resolve, reject) => {
            bcryptjs.genSalt(10, (err, salt) => {
                if (err) {
                    console.log('erro ao gerar salt');
                    return reject(err);
                }

                bcryptjs.hash(senha, salt, (err, hash) => {
                    if (err) {
                        console.log('erro ao gerar hash');
                        return reject(err);
                    }

                    resolve(hash);
                });
            });
        });
    }
}
