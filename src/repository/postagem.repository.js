export class PostagemRepository {

    async buscarPostagem() {
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