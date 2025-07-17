import { poolConexoes } from "../database/database.js";

export class CategoriaUsuarioRepository {
    async buscarCategoriasUsuario(filtros) {
        console.log('[CATEGORIA REPOSITORY] Buscando categoria usuario: ', JSON.stringify(filtros));
        let sql = `
            SELECT 
                id AS "id",
                nome AS "nome",
                data_inclusao AS "data_inclusao",
                usuario_inclusao AS "usuario_inclusao",
                data_alteracao AS "data_alteracao",
                usuario_alteracao AS "usuario_alteracao"
            FROM usuario_categoria
            WHERE 1=1
        `;

        let indeceParametro = 1;
        let valores = [];

        if(filtros.id) {
            sql += `AND id = $${indeceParametro++}`;
            valores.push(filtros.id);
        }

        if(filtros.nome) {
            sql += `AND LOWER(nome) LIKE $${indeceParametro++}`;
            valores.push(`%${filtros.nome.toLowerCase()}%`);
        }

        const { rows: resultado } = await poolConexoes.query(sql, valores);

        return {
            possuiResultado: resultado.length > 0,
            resultado: filtros.id && resultado.length ? resultado[0] : resultado
        };
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