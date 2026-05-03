# Use a lightweight Node image
FROM node:18-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
# (We will create a simple package.json in the next step)
COPY package*.json ./
RUN npm install

# Copy the rest of your code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]