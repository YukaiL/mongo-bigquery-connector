FROM node:12
WORKDIR /app
COPY . /app/
RUN npm install
RUN npm install --save mongodb
RUN npm install --save @google-cloud/bigquery
CMD node --expose-gc --max-old-space-size=600 --max-semi-space-size=50 stream_main.js