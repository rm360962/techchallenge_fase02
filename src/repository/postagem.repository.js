import { poolConexoes } from "../database/database.js";

export class PostagemRepository {

    buscarPostagens = async (filtros) => {
        console.log('[POSTAGEM REPOSITORY] Buscando postagens: ', JSON.stringify(filtros));
        let sql = `
        SELECT 
            p.id AS "id",
            p.titulo AS "titulo",
            p.descricao AS "descricao",
            p.usuario_id AS "usuario_id",
            TO_CHAR(p.data_inclusao, 'DD/MM/YYYY') AS "data_inclusao",
            p.usuario_inclusao AS "usuario_inclusao",
            TO_CHAR(p.data_alteracao, 'DD/MM/YYYY') AS "data_alteracao",
            p.usuario_alteracao AS "usuario_alteracao"
        FROM postagem p
        INNER JOIN usuario u ON u.id = p.usuario_id
        WHERE 1=1
        `;

        let indiceParametro = 1;
        const valores = [];

        if (filtros.id) {
            sql += `AND p.id = $${indiceParametro++}`;
            valores.push(filtros.id);
        } else {
            if (filtros.titulo) {
                sql += ` AND p.titulo ILIKE $${indiceParametro++}`;
                valores.push(`%${filtros.titulo}%`);
            }

            if (filtros.descricao) {
                sql += ` AND p.descricao ILIKE $${indiceParametro++}`;
                valores.push(`%${filtros.descricao}%`);
            }

            if (filtros.usuarioId) {
                sql += ` AND u.id = $${indiceParametro++}`;
                valores.push(filtros.usuarioId);
            }

            if (filtros.dataInclusaoInicio && !filtros.dataInclusaoFim) {
                sql += ` AND p.data_inclusao >= $${indiceParametro}`;
                valores.push(filtros.dataInclusaoInicio);
            } else if (!filtros.dataInclusaoInicio && filtros.dataInclusaoFim) {
                sql += ` AND p.data_inclusao <= $${indiceParametro}`;
                valores.push(filtros.dataInclusaoFim);
            } else if(filtros.dataInclusaoInicio && filtros.dataInclusaoFim) {
                sql += ` AND p.data_inclusao BETWEEN $${indiceParametro} AND $${indiceParametro + 1}`;
                valores.push(filtros.dataInclusaoInicio);
                valores.push(filtros.dataInclusaoFim);
            }
        }

        const { rows: resultado } = await poolConexoes.query(sql, valores);

        return {
            possuiResultado: resultado.length > 0,
            resultado: resultado,
        };
    };

    cadastrarPostagem = async (postagem) => {
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
    };

    editarPostagem = async (postagem) => {
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

        const { rowCount } = await poolConexoes.query(sql, [
            postagem.titulo ?? null,
            postagem.descricao ?? null,
            postagem.usuarioId ?? null,
            postagem.usuarioId,
            postagem.id
        ]);

        return rowCount > 0;
    };

    removerPostagem = async (id) => {
        const sql = `
            DELETE FROM POSTAGEM WHERE ID = $1
        `;

        const { rowCount } = await poolConexoes.query(sql, [id]);

        return rowCount > 0;
    };
}
