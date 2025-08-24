# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
# We run npm ci here because it's generally faster and more secure for production builds.
RUN npm ci

# Copy the rest of the application's source code from your host to your image filesystem.
COPY . .

# Build the React application for production
RUN npm run build

# Expose port 3000 to the outside world. `serve` defaults to this port.
EXPOSE 3000

# Command to run the application using the start script
CMD ["npm", "start"]
