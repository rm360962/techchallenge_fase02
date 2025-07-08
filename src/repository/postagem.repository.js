import { poolConexoes } from "../database/database.js";

export class PostagemRepository {

    async buscarPostagem() {
        const { rows: resultado} = await poolConexoes.query("SELECT NOW()");
        return resultado;
    };

    async cadastrarPostagem() {
        return 1;
    }

    async editarPostagem() {
        return {
            id: 1,
            editado: true,
        };
    }

    async removerPostagem() {
        return {
            id: 1,
            removido: true
        };
    }

    async buscarPorFiltros() {
        return [
            {
                id: 1,
                titulo: "teste",
                descricao: "teste",
                dataCriacao: "20/01/2020",
                usuarioInclusao: "henrique",
                usuarioAlteracao: ""
            }
        ];
    }
}