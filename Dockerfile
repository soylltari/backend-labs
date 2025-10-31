# Use the official Node.js image
FROM node:22

# Create a working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of our app into the container
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Open port 3000
EXPOSE 3000

# Run the app
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]