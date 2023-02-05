# Use the official Node.js image
FROM node:12.22.1

# Setup timezone
ENV TZ=Asia/Taipei

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy the rest of the application code to the working directory
COPY . .

# Run the build step
RUN yarn build

# Set the command to run the application when the container starts
CMD ["yarn", "start"]