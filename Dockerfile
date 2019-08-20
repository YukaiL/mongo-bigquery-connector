FROM node:12
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm install --save mongodb
RUN npm install --save @google-cloud/bigquery
CMD node stream_main.js
