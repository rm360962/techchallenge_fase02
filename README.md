# techchallenge_fase02

Projeto desenvolvido na segunda fase da postech full stack development.

## Requisitos Minimos:

- NodeJs >= 20.2.0

## Variáveis de ambiente

Varíaveis de ambiente para executar o projeto localmente.

- DATABASE_USER=postgres
- DATABASE_HOST=localhost
- DATABASE=postgres
- DATABASE_PASSWORD=1234
- DATABASE_PORT=5432
- JWT_SECRET=dd56e3b80b0e23fb78b161078a6d8ddc

## Comandos

- npm install - Instala todas as dependências da aplicação
- npm run dev - Roda a API(rotas) modo dev
- npm start - Roda a API(rotas) em modo produção
- npm run build - Faz o build da aplicação para rodar em produção
- npm run test - Roda os testes 
- docker compose -f db-dev.yml up - Executa o banco de dados
- docker compose -f db-dev.yml down -v - Limpa os dados do banco