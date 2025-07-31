CREATE TABLE IF NOT EXISTS USUARIO_CATEGORIA (
                                                 ID INTEGER PRIMARY KEY,
                                                 NOME VARCHAR(25),
                                                 PERMISSOES JSON,
                                                 DATA_INCLUSAO TIMESTAMP DEFAULT NOW(),
                                                 USUARIO_INCLUSAO VARCHAR(255),
                                                 DATA_ALTERACAO TIMESTAMP,
                                                 USUARIO_ALTERACAO VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS USUARIO (
                                       ID INTEGER PRIMARY KEY,
                                       NOME VARCHAR(100),
                                       EMAIL VARCHAR(255) UNIQUE,
                                       LOGIN VARCHAR(25) UNIQUE,
                                       SENHA VARCHAR(255),
                                       ATIVO BOOLEAN,
                                       CATEGORIA_ID INTEGER CONSTRAINT FK_USUARIO_CATEGORIA REFERENCES USUARIO_CATEGORIA(ID),
                                       DATA_INCLUSAO TIMESTAMP DEFAULT NOW(),
                                       USUARIO_INCLUSAO VARCHAR(255),
                                       DATA_ALTERACAO TIMESTAMP,
                                       USUARIO_ALTERACAO VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS POSTAGEM (
                                        ID INTEGER PRIMARY KEY,
                                        TITULO VARCHAR(255),
                                        DESCRICAO TEXT,
                                        USUARIO_ID INTEGER CONSTRAINT FK_USUARIO REFERENCES USUARIO(ID),
                                        DATA_INCLUSAO TIMESTAMP DEFAULT NOW(),
                                        USUARIO_INCLUSAO VARCHAR(255),
                                        DATA_ALTERACAO TIMESTAMP,
                                        USUARIO_ALTERACAO VARCHAR(255)
);

CREATE SEQUENCE USUARIO_CATEGORIA_SEQ_ID;
CREATE SEQUENCE USUARIO_SEQ_ID;
CREATE SEQUENCE POSTAGEM_SEQ_ID;

INSERT INTO USUARIO_CATEGORIA(ID, NOME, PERMISSOES, USUARIO_INCLUSAO, DATA_INCLUSAO) VALUES (NEXTVAL('USUARIO_CATEGORIA_SEQ_ID'), 'Aluno', '["buscar_postagem"]', 'Sistema',NOW());
INSERT INTO USUARIO_CATEGORIA(ID, NOME, PERMISSOES, USUARIO_INCLUSAO, DATA_INCLUSAO) VALUES (NEXTVAL('USUARIO_CATEGORIA_SEQ_ID'), 'Professor', '["buscar_postagem","cadastrar_postagem","editar_postagem","remover_postagem","buscar_usuario","cadastrar_usuario","editar_usuario","remover_usuario","buscar_categoria",
  "cadastrar_categoria","editar_categoria","remover_categoria"]','Sistema', NOW());
INSERT INTO USUARIO_CATEGORIA(ID, NOME, PERMISSOES, USUARIO_INCLUSAO, DATA_INCLUSAO) VALUES (NEXTVAL('USUARIO_CATEGORIA_SEQ_ID'), 'Administrador', '["buscar_postagem","cadastrar_postagem","editar_postagem","remover_postagem","buscar_usuario","cadastrar_usuario","editar_usuario","remover_usuario","buscar_categoria",
  "cadastrar_categoria","editar_categoria","remover_categoria"]','Sistema', NOW());

INSERT INTO USUARIO
(ID, NOME, EMAIL, LOGIN, SENHA, ATIVO, CATEGORIA_ID, DATA_INCLUSAO, USUARIO_INCLUSAO, DATA_ALTERACAO, USUARIO_ALTERACAO)
VALUES
    (NEXTVAL('USUARIO_SEQ_ID'), 'Sistema', 'teste.exemplo@gmail.com', 'Sistema', '$2b$10$5dCdyTCFhnOAQxq2AGryF.JMwhf9bBRfzFvd7Da.J6iB22vJezXzq', true, 3, now(), 'Sistema', NULL, NULL);

SET TIME ZONE 'America/Sao_Paulo';

