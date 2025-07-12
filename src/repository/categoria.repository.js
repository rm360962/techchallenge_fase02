import { poolConexoes } from "../database/database";

export class CategoriaUsuarioRepository {
    async buscarCategoriasUsuario(filtros) {
        console.log('[CATEGORIA REPOSITORY] Buscando categoria usuario: ', JSON.stringify(filtros));
        const sql = `
            SELECT 
                id AS "id",
                nome AS "nome",
                data_inclusao AS "data_inclusao",
                usuario_inclusao AS "usuario_inclusao",
                data_alteracao AS "data_alteracao",
                usuario_alteracao AS "usuario_alteracao"
            FROM usuario_categoria
        `;

        const { rows: resultado } = await poolConexoes.query(sql);

        return resultado;
    };

    async cadastrarCategoriaUsuario(usuarioCategoria) {
        console.log('[CATEGORIA REPOSITORY] Cadastrando categoria usuario: ', JSON.stringify(usuarioCategoria));
        const sql = `
        INSERT INTO USUARIO_CATEGORIA (
            ID,
            NOME,
            DATA_INCLUSAO,
            USUARIO_INCLUSAO
        ) VALUES (
            NEXTVAL('USUARIO_CATEGORIA_SEQ_ID'),
            $1,
            NOW(),
            $2
        ) RETURNING ID;
        `;

        const { rows: resultado } = await poolConexoes.query(sql, [
            usuarioCategoria.nome,
            usuarioCategoria.usuarioInclusao,
        ]);

        return resultado[0].id;
    }

    async removerCategoriaUsuario(id) {
        console.log('[CATEGORIA REPOSITORY] Deletando categoria usuario com id: ', id);
        const sql = `
            DELETE FROM USUARIO_CATEGORIA WHERE ID = $1
        `;

        const { rowCount } = await poolConexoes.query(sql, [id]);

        return rowCount > 0;
    }

}