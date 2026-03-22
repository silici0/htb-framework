# Dockerfile for HTB Framework
FROM node:18-alpine

# Install basic network tools
RUN apk add --no-cache \
    curl \
    wget \
    nmap \
    git \
    && rm -rf /var/cache/apk/*

# Create working directory
WORKDIR /app

# Copy configuration files
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.js ./

# Install dependencies
RUN npm install --production && npm cache clean --force

# Copy source code (excluding unnecessary files)
COPY . .

# Create projects directory
RUN mkdir -p projects

# Expose port
EXPOSE 3000

# Comando padrão
CMD ["npm", "run", "dev"]
