# add the Node.js docker image
FROM node:alpine as development

# Create directory that runs the app on docker
WORKDIR /app

# COPY package.json and yarn.lock files
COPY ./package.json ./yarn.lock ./

# Install package.json dependencies
RUN yarn install
RUN yarn cache clean

# COPY in order 1. tsconfig.json 2. prisma folder 3. src folder
COPY ./tsconfig.json ./
COPY ./prisma ./prisma
COPY ./src ./

# Generate prisma client
RUN npx prisma generate

# Run and expose the server on port 4000
EXPOSE 4000

# A command to start the server
CMD [ "yarn", "run", "docker:start" ]