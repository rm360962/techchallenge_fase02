FROM node:20-slim

ENV DATABASE_USER=postgres
ENV DATABASE_HOST=localhost
ENV DATABASE=postgres
ENV DATABASE_PASSWORD=1234
ENV DATABASE_PORT=5432
ENV JWT_SECRET=dd56e3b80b0e23fb78b161078a6d8ddc

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . ./

RUN pwd

RUN ls

RUN npm run build

COPY . .

EXPOSE 3030

CMD [ "npm", "start" ]
