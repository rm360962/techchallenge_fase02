import { poolConexoes } from "../database/database";

export class UsuarioRepository {

    async buscarUsuarios(filtros) {
        console.log('[USUARIO REPOSITORY] Buscando usuarios: ', JSON.stringify(filtros));
        const sql = `
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

        const { rows: resultado } = await poolConexoes.query(sql);

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

        return resultadoNormalizado;
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