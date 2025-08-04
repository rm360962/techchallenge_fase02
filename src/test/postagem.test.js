import { beforeEach, describe, expect, it, vi } from "vitest";
import { PostagemService } from "../service/postagem.service.js";

describe('PostagemService', () => {
	let postagemRepositoryMock;
	let usuarioRepositoryMock;
	let postagemService;

	const mockBuscaPostagem = {
		possuiResultado: true,
		resultado: [
			{
				id: 1,
				titulo: 'Exemplo 1',
				descricao: 'Exemplo de descrição',
				usuario: {
					id: 1,
					nome: 'Sistema',
				},
				dataInclusao: '01/01/2025 08:00:00',
				usuarioInclusao: 'Sistema',
				dataAlteracao: null,
				usuarioAlteracao: null,
			},
		],
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
	const mockIdPostagem = 1;
	const mockEdicaoPostagem = true;

	beforeEach(() => {
		postagemRepositoryMock = {
			buscarPostagens: vi.fn(),
			cadastrarPostagem: vi.fn(),
			editarPostagem: vi.fn(),
			removerPostagem: vi.fn(),
		};

		usuarioRepositoryMock = {
			buscarUsuarios: vi.fn(),
		};

		postagemRepositoryMock.buscarPostagens.mockResolvedValue(mockBuscaPostagem);
		postagemRepositoryMock.cadastrarPostagem.mockResolvedValue(mockIdPostagem);
		postagemRepositoryMock.editarPostagem.mockResolvedValue(mockEdicaoPostagem);
		postagemRepositoryMock.removerPostagem.mockResolvedValue(mockEdicaoPostagem);

		usuarioRepositoryMock.buscarUsuarios.mockResolvedValue(mockUsuario);

		postagemService = new PostagemService(postagemRepositoryMock, usuarioRepositoryMock);
	});

	it('Deve buscar as postagens', async () => {
		const filtros = {};
		const resultado = await postagemService.buscar(filtros);

		expect(postagemRepositoryMock.buscarPostagens).toHaveBeenCalledWith(filtros);
		expect(resultado.status).toBe(200);
		expect(resultado.resposta).toEqual(mockBuscaPostagem.resultado);
	});

	it('Deve cadastrar uma postagem', async () => {
		const postagem = {
			titulo: 'Teste 1',
			descricao: 'Teste usando vitest',
			usuarioId: 1,
		};

		const resultado = await postagemService.cadastrar(postagem);

		expect(postagemRepositoryMock.cadastrarPostagem).toHaveBeenCalledWith(postagem);
		expect(resultado.status).toBe(201);
		expect(resultado.resposta).toEqual({
			id: mockIdPostagem,
			mensagem: 'Postagem cadastrada com sucesso',
		});
	});

	it('Deve editar uma postagem', async () => {
		const postagem = {
			id: 1,
			titulo: 'Teste 2',
			usuarioAlteracao: 'Sistema',
		};

		const resultado = await postagemService.editar(postagem);

		expect(postagemRepositoryMock.buscarPostagens).toHaveBeenCalledWith({ id: postagem.id });
		expect(postagemRepositoryMock.editarPostagem).toHaveBeenCalledWith(postagem);
		expect(resultado.status).toBe(200);
		expect(resultado.resposta).toEqual({
			mensagem: 'Postagem editada com sucesso',
		});
	});

	it('Não deve editar uma postagem', async () => {
		postagemRepositoryMock.buscarPostagens.mockResolvedValueOnce({ possuiResultado: false });
		
		const postagem = {
			id: 1,
			titulo: 'Teste 2',
			usuarioAlteracao: 'Sistema',
		};

		const resultado = await postagemService.editar(postagem);

		expect(postagemRepositoryMock.buscarPostagens).toHaveBeenCalledWith({ id: postagem.id });
		expect(resultado.status).toBe(400);
		expect(resultado.resposta).toEqual({
			mensagem: `Postagem ${postagem.id} não foi encontrada`,
		});
	});

	it('Deve remover uma postagem', async () => {
		const idPostagem = 1;

		const resultado = await postagemService.remover(idPostagem);

		expect(postagemRepositoryMock.buscarPostagens).toHaveBeenCalledWith({ id: idPostagem });
		expect(postagemRepositoryMock.removerPostagem).toHaveBeenCalledWith(idPostagem);
		expect(resultado.status).toBe(200);
		expect(resultado.resposta).toEqual({
			mensagem: 'Postagem removida com sucesso',
		});
	});

	it('Não deve remover uma postagem', async () => {
		postagemRepositoryMock.buscarPostagens.mockResolvedValueOnce({ possuiResultado: false });

		const idPostagem = 1;

		const resultado = await postagemService.remover(idPostagem);

		expect(postagemRepositoryMock.buscarPostagens).toHaveBeenCalledWith({ id: idPostagem });
		expect(resultado.status).toBe(400);
		expect(resultado.resposta).toEqual({
			mensagem: `Postagem ${idPostagem} não foi encontrada`,
		});
	});
});