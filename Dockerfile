FROM node:16-alpine as builder
WORKDIR /src
COPY package.json package-lock.json* ./
RUN npm install 
COPY . .
EXPOSE 3001
CMD ["npm", "run", "start"]