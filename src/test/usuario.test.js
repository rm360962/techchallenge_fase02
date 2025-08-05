import { beforeEach, describe, expect, it, vi } from 'vitest';
import { UsuarioService } from '../service/usuario.service.js';

describe('UsuarioService', () => {
	let usuarioService;
	let usuarioRepositoryMock;
	let categoriaUsuarioRepositoryMock;

	const mockCadastroUsuario = 1;
	const mockEdicaoUsuario = true;
	const mockCategoriaUsuario = {
		possuiResultado: true,
		resultado: [
			{
				id: 1,
				nome: 'Aluno',
				permissoes: ['buscar_postagem'],
				dataInclusao: '01/01/2025 08:00:00',
				usuarioInclusao: 'Sistema',
			}
		]
	};
	const mockUsuario = {
		possuiResultado: true,
		resultado: [
			{
				"id": 1,
				"login": "teste123",
				"nome": "Sistema",
				"email": "teste@gmail.com",
				"categoria": {
					"id": 3,
					"nome": "Administrador",
					"permissoes": [
						"buscar_postagem",
						"cadastrar_postagem",
						"editar_postagem",
						"remover_postagem",
						"buscar_usuario",
						"cadastrar_usuario",
						"editar_usuario",
						"remover_usuario",
						"buscar_categoria",
						"cadastrar_categoria",
						"editar_categoria",
						"remover_categoria"
					]
				},
				"ativo": true,
				"dataInclusao": "30/07/2025 21:07:29",
				"dataAlteracao": null,
				"usuarioInclusao": "Sistema",
				"usuarioAlteracao": null
			}
		]
	};

	beforeEach(() => {
		usuarioRepositoryMock = {
			buscarUsuarios: vi.fn(),
			cadastrarUsuario: vi.fn(),
			editarUsuario: vi.fn(),
		};

		categoriaUsuarioRepositoryMock = {
			buscarCategoriasUsuario: vi.fn(),
		};

		usuarioRepositoryMock.buscarUsuarios.mockResolvedValue(mockUsuario);
		usuarioRepositoryMock.cadastrarUsuario.mockResolvedValue(mockCadastroUsuario);
		usuarioRepositoryMock.editarUsuario.mockResolvedValue(mockEdicaoUsuario);
		categoriaUsuarioRepositoryMock.buscarCategoriasUsuario.mockResolvedValue(mockCategoriaUsuario);

		usuarioService = new UsuarioService(usuarioRepositoryMock, categoriaUsuarioRepositoryMock);
	});

	it('Deve retornar os usuários', async () => {
		const filtros = {};
		const resultado = await usuarioService.buscar(filtros);

		expect(usuarioRepositoryMock.buscarUsuarios).toHaveBeenCalledWith(filtros);
		expect(resultado.status).toBe(200);
		expect(resultado.resposta).toEqual(mockUsuario.resultado);
	});

	it('Deve cadastrar um usuário', async () => {
		usuarioRepositoryMock.buscarUsuarios.mockResolvedValueOnce({ possuiResultado: false });

		const usuario = {
			nome: 'Teste',
			email: 'teste@gmail.com',
			login: 'teste123',
			senha: '1234',
			categoriaId: 1,
		};

		const resultado = await usuarioService.cadastrar(usuario);

		expect(categoriaUsuarioRepositoryMock.buscarCategoriasUsuario).toHaveBeenCalledWith({ id: usuario.categoriaId });
		expect(usuarioRepositoryMock.buscarUsuarios).toHaveBeenCalledWith({ email: usuario.email, login: usuario.login, validarUnique: true });
		expect(usuarioRepositoryMock.cadastrarUsuario).toHaveBeenCalledWith(usuario);
		expect(resultado.status).toBe(201);
		expect(resultado.resposta).toEqual({
			id: mockCadastroUsuario,
			mensagem: 'Usuário cadastrado com sucesso',
		});
	});

	it('Não deve cadastrar um usuário', async () => {
		const usuario = {
			nome: 'Teste',
			email: 'teste@gmail.com',
			login: 'teste123',
			senha: '1234',
			categoriaId: 1,
		};

		const resultado = await usuarioService.cadastrar(usuario);

		expect(categoriaUsuarioRepositoryMock.buscarCategoriasUsuario).toHaveBeenCalledWith({ id: usuario.categoriaId });
		expect(usuarioRepositoryMock.buscarUsuarios).toHaveBeenCalledWith({ email: usuario.email, login: usuario.login, validarUnique: true });
		expect(resultado.status).toBe(400);
		expect(resultado.resposta).toEqual({
			mensagem: 'Email: teste@gmail.com ou Login: teste123 já cadastrado no sistema'
		});
	});

	it('Deve editar um usuário', async () => {
		const usuario = {
			id: 1,
			nome: 'teste2',
		};

		const resultado = await usuarioService.editar(usuario);

		expect(usuarioRepositoryMock.buscarUsuarios).toHaveBeenCalledWith({ id: usuario.id, ativo: true });
		expect(usuarioRepositoryMock.editarUsuario).toHaveBeenCalledWith(usuario);
		expect(resultado.status).toBe(200);
		expect(resultado.resposta).toEqual({
			mensagem: 'Usuário editado com sucesso',
		});
	});

	it('Deve inativar um usuário', async () => {
		const usuario = {
			id: 1,
			usuarioAlteracao: 'Sistema',
			ativo: false,
		};

		const resultado = await usuarioService.remover(usuario);

		expect(usuarioRepositoryMock.buscarUsuarios).toHaveBeenCalledWith({ id: usuario.id });
		expect(usuarioRepositoryMock.editarUsuario).toHaveBeenCalledWith(usuario);
		expect(resultado.status).toBe(200);
		expect(resultado.resposta).toEqual({
			mensagem: 'Usuário removido com sucesso'
		});
	});
});
