FROM node:alpine as development
WORKDIR /app
COPY ./client/package.json .
RUN npm i
COPY ./client .
## EXPOSE [Port you mentioned in the vite.config file]
EXPOSE 5173
CMD ["npm", "run", "dev"]