# backend/Dockerfile

FROM node:18

# Cria diretório de app
WORKDIR /usr/src/app

# Copia arquivos
COPY package*.json ./
RUN npm install
COPY . .

# Expõe a porta padrão do Cloud Run
EXPOSE 8080

# Inicia a aplicação
CMD [ "node", "index.js" ]
