# Use an official Node.js runtime as a base image
FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire app to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Command to run the app
CMD ["npm", "start"]
