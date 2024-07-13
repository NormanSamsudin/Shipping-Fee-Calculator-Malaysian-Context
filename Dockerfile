# Use the official Node.js image as the base image
FROM node:18.17.0

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package.json ./

# Install the dependencies
RUN rm -rf node_modules && npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["node", "./server.js"]
