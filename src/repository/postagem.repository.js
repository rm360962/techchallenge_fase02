import { poolConexoes } from "../database/database.js";

export class PostagemRepository {

    buscarPostagens = async (filtros) => {
		console.log('[POSTAGEM REPOSITORY] Buscando postagens:', JSON.stringify(filtros));
        let sql = `
        SELECT 
            p.id AS "id",
            p.titulo AS "titulo",
            p.descricao AS "descricao",
            p.usuario_id AS "usuarioId",
			u.nome as "nomeUsuario",
            TO_CHAR(p.data_inclusao, 'DD/MM/YYYY hh24:mi:ss') AS "dataInclusao",
            p.usuario_inclusao AS "usuarioInclusao",
            TO_CHAR(p.data_alteracao, 'DD/MM/YYYY hh24:mi:ss') AS "dataAlteracao",
            p.usuario_alteracao AS "usuarioAlteracao"
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

		const resultadoNormalizado = resultado.map((item) => {
			return {
				id: item.id,
				titulo: item.titulo,
				descricao: item.descricao,
				usuario: {
					id: item.usuarioId,
					nome: item.nomeUsuario,
				},
				dataInclusao: item.dataInclusao,
				dataAlteracao: item.dataAlteracao,
				usuarioInclusao: item.usuarioInclusao,
				usuarioAlteracao: item.usuarioAlteracao,
			};
		});
		return {
			possuiResultado: resultadoNormalizado.length > 0,
			resultado: filtros.id ? resultadoNormalizado[0] : resultadoNormalizado,
        };
    };

    cadastrarPostagem = async (postagem) => {
		console.log('[POSTAGEM REPOSITORY] Cadastrando postagem:', JSON.stringify(postagem));

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
		console.log('[POSTAGEM REPOSITORY] Editando postagem:', JSON.stringify(postagem));
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
			postagem.usuarioAlteracao,
            postagem.id
        ]);

        return rowCount > 0;
    };

    removerPostagem = async (id) => {
		console.log('[POSTAGEM REPOSITORY] Deletando postagem:', id);
        const sql = `
            DELETE FROM POSTAGEM WHERE ID = $1
        `;

        const { rowCount } = await poolConexoes.query(sql, [id]);

        return rowCount > 0;
    };
}
