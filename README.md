# mongo-bigquery-connector

mongo-bigquery-connector is an internal intern project at Harness. It consists of a connector which queries data from mongodb and streams it into Google BigQuery, and dashboards generated from BigQuery data in Google Data Studio for visualization and analysis purpose.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development or testing purposes.

The script will be run as a docker image. Necessary credentials are need for it to run successfully.

### Prerequisites: Running the script in Docker container

#### 1. Credentials

##### 1.1. Google credentials

- Follow [Google authentication instruction](https://cloud.google.com/docs/authentication/getting-started) to create a service account key.

- Save the key JSON key file locally.

##### 1.2. Mongodb url

Go to [Vault](https://vault-internal.harness.io:8200/ui/vault/secrets?with=okta) and get:
`db_address`
`db_database`
`db_port`
`db_read_password`
`db_read_user`

and construct the url according to format.

#### 1. Docker

- Install [Docker](https://docs.docker.com/install/) for your OS.

- Log into the Docker Hub from the command line by entering `docker login`, and then your credentials for Harness account.

- Pull the mongo-bigquery-connector image from Docker Hub:

```
docker pull us.gcr.io/platform-205701/harness/mongo-bigquery-connector:latest
```

- Run the image:

```Shell
docker run -e GOOGLE_APPLICATION_CREDENTIALS="/app/var/bigquery_credential.json" -e MONGO_URL=<"mongo_url"> -e BIGQUERY_DATASET=<’dataset_name’> -e MONGO_CONNECTOR_BATCHSIZE=<batch_size> -v <path_to_local_dir_containing_google_credential_file>:/app/var us.gcr.io/platform-205701/harness/mongo-bigquery-connector
```

### Prerequisites: Running script on local machine

#### 1. Download this repository

#### 2. Latest nodejs

For Mac users:

```
$ brew install node
```

For Windows users:
Download the latest Node js from [HERE](https://nodejs.org/en/download/)

#### 3. Credentials

##### 3.1. Google credentials

- Follow [Google authentication instruction](https://cloud.google.com/docs/authentication/getting-started) to create a service account key.

- Set the environment variable **_GOOGLE_APPLICATION_CREDENTIALS_** to the path to the key file.

For example:

```
export GOOGLE_APPLICATION_CREDENTIALS="<path_to_the_repository>/data/bigquery_credential.json"
```

##### 3.2. BigQuery

Set **_BIGQUERY_DATASET_ID_** to the target BigQuery dataset.

For example:

```
export BIGQUERY_DATASET_ID="qa"
```

##### 3.3. Mongodb url

Go to the [Vault](https://vault-internal.harness.io:8200/ui/vault/secrets?with=okta) and get necessary url(secrets/mongodb/qa), and set it as an environment variable.

For example:

```
export MONGO_QA_URL="url-to-connect-mongodb"
```

#### 4. Google Bigquery and Mongo package

Run

```
$ npm install --save @google-cloud/bigquery
$ npm install --save mongodb
```

#### 5. [OPTIONAL] Specify the batch size for streaming

Set it as environment variable **_MONGO_CONNECTOR_BATCHSIZE_**.
Default value is 1000.

For example:

```
export MONGO_CONNECTOR_BATCHSIZE=2000
```

### 6. Running the script

Run:

```
$ node stream_main.js
```

## Authors

- **Yukai Luo** - _Initial work_ -

## Acknowledgments

Big thanks to Puneet and everyone who helped me on this small project.
I'm really grateful for your time and help!
