# Defina a imagem base (Node.js)
FROM node:20-alpine

# Diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos de dependência do projeto
COPY package*.json ./

# Instale as dependências do React
RUN npm install

# Copie todo o código do frontend
COPY . .

# Compilar o app React para produção
RUN npm run build

# Exponha a porta onde o app React vai rodar
EXPOSE 5173

# Inicie o servidor
CMD ["npm", "run", "dev", "--", "--host"]
