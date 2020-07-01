FROM node:13-alpine
COPY . /a6-compx-sails-app
WORKDIR /a6-compx-sails-app
RUN npm install
RUN npm -g install sails
RUN npm install sails-mysql --save
EXPOSE 1337
CMD sails lift