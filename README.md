# IoTurn
Monitoramento inteligente via LoRa, com IoT, IA e chatbot para a Indústria 4.0


# docker-compose.yml
version: '3.8'

services:
  # Serviço do Banco de Dados
  db:
    image: mysql:8.0
    container_name: mysql_db
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD} # Use um arquivo .env para senhas
      MYSQL_DATABASE: ${DB_NAME}
      MYSQL_USER: ${DB_USER}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql # Volume para persistir os dados do MySQL
    networks:
      - app-network

  # Serviço do Cache
  cache:
    image: redis:7-alpine
    container_name: redis_cache
    restart: unless-stopped
    networks:
      - app-network

  # Serviço do Backend (Node.js)
  backend:
    build:
      context: ./backend # Assumindo que seu Dockerfile está na pasta 'backend'
      dockerfile: Dockerfile
    container_name: node_backend
    restart: unless-stopped
    ports:
      - "3333:3333" # Expõe a porta 3333 do container para o host
    depends_on:
      - db   # Garante que o banco de dados inicie antes do backend
      - cache # Garante que o redis inicie antes do backend
    environment:
      DATABASE_URL: "mysql://${DB_USER}:${DB_PASSWORD}@db:3306/${DB_NAME}"
      REDIS_HOST: 'cache'
      REDIS_PORT: 6379
    networks:
      - app-network

  # Serviço do Frontend (React)
  frontend:
    build:
      context: ./frontend # Assumindo que seu Dockerfile está na pasta 'frontend'
      dockerfile: Dockerfile
    container_name: react_frontend
    restart: unless-stopped
    ports:
      - "80:80" # Expõe a porta 80 do container (servidor web como NGINX) para a porta 80 do host
    depends_on:
      - backend # O frontend geralmente depende do backend para fazer chamadas de API
    networks:
      - app-network

# Define a rede que os containers usarão para se comunicar
networks:
  app-network:
    driver: bridge

# Define o volume nomeado para persistir os dados
volumes:
  mysql_data:
    driver: local
