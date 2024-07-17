FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y cron

RUN npm install -g typescript

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN tsc

EXPOSE 4001

# CMD  node dist/index.js
CMD ["node", "dist/index.js"]
