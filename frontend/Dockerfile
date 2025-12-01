# Dockerfile for frontend

# Use a Node.js base image
FROM node:20

# Set the working directory in the container
WORKDIR /frontend

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

# Install a simple HTTP server to serve the app
RUN npm install -g serve

# Expose the desired port
EXPOSE 3000

# Start the application using "serve"
CMD ["serve", "-s", "build"]