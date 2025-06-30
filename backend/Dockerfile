# Usa uma imagem Node.js oficial
FROM node:18

# Cria diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências e instala
COPY package*.json ./
RUN npm install

# Copia todo o código
COPY . .

# Garante que a porta 8080 será usada
EXPOSE 8080

# Comando para iniciar o app
CMD ["node", "server.js"]
