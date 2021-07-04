FROM node:15.12.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i --silent
RUN npm install -g typescript
COPY . ./
RUN tsc
EXPOSE 6666
ENTRYPOINT [ "node", "dist/index.js" ]