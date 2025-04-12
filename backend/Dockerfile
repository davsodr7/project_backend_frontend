# Defina a imagem base (Node.js)
FROM node:20-alpine

# Diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos de dependência do projeto
COPY package*.json ./

# Instale as dependências do Node.js
RUN npm install

# Copie todo o código do backend
COPY . .

# Exponha a porta onde o app Node.js vai rodar
EXPOSE 5000

# Inicie o servidor do backend
CMD ["npm", "start"]
