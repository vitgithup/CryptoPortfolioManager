FROM node:20

WORKDIR /app

RUN apt-get update && apt-get install -y cron

RUN npm install -g typescript

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN apt-get update && apt-get install -y cron

COPY my_script.sh /usr/local/bin/my_script.sh
# Set up the cron job to run every 1 minute
RUN echo "* * * * * root /usr/local/bin/my_script.sh >> /var/log/output.log 2>&1" > /etc/cron.d/my-cron-job
RUN chmod 0644 /etc/cron.d/my-cron-job

RUN touch /var/log/output.log
RUN chmod 0777 /var/log/output.log


RUN tsc


CMD  cron -f
