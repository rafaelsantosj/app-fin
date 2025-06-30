# Use imagem oficial Node.js
FROM node:18

# Cria diretório de app
WORKDIR /usr/src/app

# Copia dependências
COPY package*.json ./
RUN npm install

# Copia todo o restante
COPY . .

# Define porta obrigatória para Cloud Run
ENV PORT 8080
EXPOSE 8080

# Comando para rodar o backend
CMD ["npm", "start"]
