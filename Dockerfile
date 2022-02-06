FROM node:12.16.3

WORKDIR /blanklyiscool

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5000

EXPOSE 5000
ENTRYPOINT ["npm", "start"]