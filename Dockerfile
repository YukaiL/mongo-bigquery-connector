FROM node:12
WORKDIR /app
COPY stream_main.js package.json transformation_fn.js time.js /app/
RUN mkdir data
RUN npm install
RUN npm install --save mongodb
RUN npm install --save @google-cloud/bigquery
ARG buildtime_variable='./data/bigquery_credential.json'
ENV GOOGLE_APPLICATION_CREDENTIALS=$buildtime_variable
CMD node stream_main.js