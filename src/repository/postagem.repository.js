import { poolConexoes } from "../database/database.js";

export class PostagemRepository {

    async buscarPostagem() {
        const sql = `
        SELECT 
            ID AS "id",
            TITULO AS "titulo",
            DESCRICAO AS "descricao",
            USUARIO_ID AS "usuario_id",
            TO_CHAR(DATA_INCLUSAO, 'DD/MM/YYYY') AS "data_inclusao",
            USUARIO_INCLUSAO AS "usuario_inclusao",
            TO_CHAR(DATA_ALTERACAO, 'DD/MM/YYYY') AS "data_alteracao",
            USUARIO_ALTERACAO AS "usuario_alteracao"
        FROM POSTAGEM
        `;

        const { rows: resultado } = await poolConexoes.query(sql);

        return resultado;
    };

    async cadastrarPostagem(postagem) {
        console.log('[POSTAGEM REPOSITORY] Cadastrando postagem', JSON.stringify(postagem));

        const sql = `
        INSERT INTO POSTAGEM (
            ID,
            TITULO,
            DESCRICAO,
            USUARIO_ID,
            USUARIO_INCLUSAO
        ) VALUES (
        NEXTVAL('POSTAGEM_SEQ_ID'),
            $1, 
            $2,
            $3, 
            $4  
        ) RETURNING ID;
        `;

        const { rows: resultado } = await poolConexoes.query(sql, [
            postagem.titulo,
            postagem.descricao,
            postagem.usuarioId,
            postagem.usuarioInclusao,
        ]);

        return resultado[0].id;
    }

    async editarPostagem(postagem) {
        const sql = `
        UPDATE POSTAGEM
        SET 
            TITULO = COALESCE($1, TITULO),
            DESCRICAO = COALESCE($2, DESCRICAO),
            USUARIO_ID = COALESCE($3, USUARIO_ID),
            DATA_ALTERACAO = NOW(),
            USUARIO_ALTERACAO = $4
        WHERE ID = $5;
        `;

        const { rowCount } = await poolConexoes.query(sql,[
            postagem.titulo ?? null,
            postagem.descricao ?? null,
            postagem.usuarioId ?? null,
            postagem.usuarioId,
            postagem.id 
        ]);

        return rowCount > 0;
    }

    async removerPostagem(id) {
        const sql = `
            DELETE FROM POSTAGEM WHERE ID = :id
        `;

        const { rowCount } = await poolConexoes.query(sql, {
            id: id,
        });

        return rowCount > 0;
    }   

    async buscarPorFiltros(filtros) {
        console.log('[POSTAGEM REPOSITORY] Buscando postagens por filtro:', JSON.stringify(filtros));
        const { id } = filtros;
        const sql = `
        SELECT 
            ID AS "id",
            TITULO AS "titulo",
            DESCRICAO AS "descricao",
            USUARIO_ID AS "usuario_id",
            DATA_INCLUSAO AS "data_inclusao",
            USUARIO_INCLUSAO AS "usuario_inclusao",
            DATA_ALTERACAO AS "data_alteracao",
            USUARIO_ALTERACAO AS "usuario_alteracao"
        FROM POSTAGEM
        WHERE 1=1
            ${id != null ? `AND ID = $1` : ''}
        `;

        const { rows: resultado } = await poolConexoes.query(sql, [ id ]);

        return resultado;
    }
}