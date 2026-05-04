FROM node:18-slim
WORKDIR /app
COPY package*.json ./
# Add prom-client to your install command
RUN npm install express mongoose prom-client 
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]