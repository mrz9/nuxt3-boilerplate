FROM node:14.16.1-alpine
ARG port=30000
ARG env=dev

WORKDIR /app
COPY . .

EXPOSE ${port}

ENV NODE_ENV=production
ENV APP_MODE=${env}
ENV PORT=${port}
#RUN npm config set registry https://registry.npm.taobao.org
RUN npm install --production
CMD ["node", "app.js"]
# docker build --build-arg env=dev --build-arg port=8080 -t agc-web-release .
# docker container run --rm -p 8080:8080  -it agc-web-release
