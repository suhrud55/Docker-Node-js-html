# Use official Node.js LTS version as base
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching layers)
COPY package*.json ./

# Install dependencies (not needed here but good practice)
RUN npm install

# Copy app source code
COPY . .

# Expose port (81 as per index.js)
EXPOSE 6309

# Start the app
CMD ["npm", "start"]
