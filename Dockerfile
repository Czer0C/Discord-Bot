# Use Node.js 20 as the base image
FROM node:20

# Set the working directory
WORKDIR /app

# Copy dependency files and install dependencies
COPY package*.json ./
RUN npm ci --production

# Copy application files
COPY . .

# Expose the port and run the application
EXPOSE 3000
CMD ["node", "index.js"]
