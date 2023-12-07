FROM node:16-alpine as builder

WORKDIR /src


COPY package.json package-lock.json* ./

RUN npm install 


COPY . .


ENV NODE_ENV=production
ENV PORT=3000
ENV MONGODBURL=mongodb+srv://nuitinfo:nuit1234@cluster0.7l8yo.mongodb.net/nuitInfo?retryWrites=true&w=majority
ENV EMAIL_SENDER=m.benromdhane@arsela.co
ENV EMAIL_PASS=m.benromdhane1
ENV TOKEN_KEY=cejnc&jnekjcnCND145dv

EXPOSE $PORT


CMD ["npm", "run", "start"]
