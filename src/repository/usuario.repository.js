import { poolConexoes } from "../database/database.js";

export class UsuarioRepository {

    async buscarUsuarios(filtros) {
        console.log('[USUARIO REPOSITORY] Buscando usuario:', JSON.stringify(filtros));

        let sql = `
        SELECT 
            u.id AS "id",
            u.nome AS "nome",
            u.email AS "email",
            u.categoria_id AS "categoriaId",
            uc.nome AS "categoriaNome",
            u.data_inclusao AS "dataInclusao",
            u.usuario_inclusao AS "usuarioInclusao",
            u.data_alteracao AS "dataAlteracao",
            u.usuario_alteracao AS "usuarioAlteracao"
        FROM usuario u
        INNER JOIN usuario_categoria uc ON u.categoria_id = uc.id
        WHERE 1=1
        `;

        let indiceParametro = 1;
        const valores = [];

        if (filtros.id) {
            sql += `AND u.id = $${indiceParametro++}`;
            valores.push(filtros.id);
        } else {
            if (filtros.nome) {
                sql += `AND LOWER(u.nome) LIKE $${indiceParametro++}`;
                valores.push(`%${filtros.nome.toLowerCase()}%`);
            }

            if (filtros.email && !filtros.validacaoEmail) {
                sql += `AND LOWER(u.email) LIKE $${indiceParametro++}`;
                valores.push(`%${filtros.email.toLowerCase()}%`);
            }

            if (filtros.email && filtros.validacaoEmail) {
                sql += `AND LOWER(u.email) = $${indiceParametro++}`;
                valores.push(filtros.email);
            }

            if (filtros.categoriaId) {
                sql += `AND u.categoria_id = $${indiceParametro++}`;
                valores.push(filtros.categoriaId);
            }
        }

        const { rows: resultado } = await poolConexoes.query(sql, valores);

        const resultadoNormalizado = resultado.map((item) => {
            return {
                id: item.id,
                nome: item.nome,
                email: item.email,
                categoria: {
                    id: item.categoriaId,
                    nome: item.categoriaNome,
                },
                dataInclusao: item.dataInclusao,
                dataAlteracao: item.dataAlteracao,
                usuarioInclusao: item.usuarioInclusao,
                usuarioAlteracao: item.usuarioAlteracao
            };
        });

        return {
            possuiResultado: resultadoNormalizado.length > 0,
            resultado: filtros.id != null && resultadoNormalizado.length > 0 ? resultadoNormalizado[0] : resultadoNormalizado,
        };
    }

    async cadastrarUsuario(usuario) {
        console.log('[USUARIO REPOSITORY] Cadastrando usuario: ', JSON.stringify(usuario));
        const sql = `
        INSERT INTO usuario (
            id,
            nome,
            email,
            senha,
            categoria_id,
            data_inclusao,
            usuario_inclusao
        ) VALUES (
            NEXTVAL('USUARIO_SEQ_ID'),
            $1,
            $2,
            $3,
            $4,
            NOW(),
            $5
        ) RETURNING ID;
        `;

        const { rows: resultado } = await poolConexoes.query(sql, [
            usuario.nome,
            usuario.email,
            usuario.senha,
            usuario.categoriaId,
            usuario.usuarioInclusao
        ]);

        return resultado[0].id;
    }

    async editarUsuario(usuario) {
        console.log('[USUARIO REPOSITORY] Editando usuario: ', JSON.stringify(usuario));
        const sql = `
        UPDATE usuario
        SET
            nome = COALESCE($1, nome),
            email = COALESCE($2, email),
            senha = COALESCE($3, senha),
            categoria_id = COALESCE($4, categoria_id),
            data_alteracao = NOW(),
            usuario_alteracao = COALESCE($5, usuario_alteracao)
        WHERE id = $6;
        `;

        const { rowCount } = await poolConexoes.query(sql, [
            usuario.nome ?? null,
            usuario.email ?? null,
            usuario.senha ?? null,
            usuario.categoriaId ?? null,
            usuario.usuarioInclusao,
            usuario.id,
        ]);

        return rowCount > 0;
    }

    async removerUsuario(id) {
        console.log('[USUARIO REPOSITORY] Deletando usuario com id: ', id);
        const sql = `
            DELETE FROM USUARIO WHERE ID = $1
        `;

        const { rowCount } = await poolConexoes.query(sql, [id]);

        return rowCount > 0;
    }
}