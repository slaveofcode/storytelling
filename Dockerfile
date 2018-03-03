FROM node:carbon

RUN mkdir /usr/src/app

COPY . /usr/src/app

WORKDIR /usr/src/app
ENV NODE_ENV production

RUN npm i --production
RUN npm i -g nodemon

CMD ["nodemon", "start"]

expose 1831
expose 3000