# Dockerfile

# Etapa 1: usa uma imagem base com Node.js
FROM node:18

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package*.json ./
COPY . .

# Instala dependências
RUN npm install

# Expõe a porta padrão do Cloud Run
EXPOSE 8080

# Inicia a aplicação
CMD [ "node", "index.js" ]
