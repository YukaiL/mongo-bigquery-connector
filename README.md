# mongo-bigquery-connector

mongo-bigquery-connector is an internal intern project at Harness. It consists of a connector which queries data from mongodb and streams it into Google BigQuery, and dashboards generated from BigQuery data in Google Data Studio for visualization and analysis purpose.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development or testing purposes.

The script will be run as a docker image. Necessary credentials are need for it to run successfully.

### Prerequisites: Running the script in Docker container

#### 1. Credentials

##### 1.1. Google credentials

- Follow [Google authentication instruction](https://cloud.google.com/docs/authentication/getting-started) to create a service account key.

- Save the key JSON file locally.

##### 1.2. Mongodb url

Go to the [Vault](https://vault-internal.harness.io:8200/ui/vault/secrets?with=okta) and get:
 `db_address`
 `db_database`
 `db_port`
 `db_read_password`
 `db_read_user`

#### 1. Docker

- Install [Docker](https://docs.docker.com/install/) for your OS.

- Log into the Docker Hub from the command line by entering `docker login`, and then your credentials for Harness account.

- Pull the mongo-bigquery-connector image from Docker Hub:

```
docker pull us.gcr.io/platform-205701/harness/mongo-bigquery-connector
```

- Run the image:

```
docker run --env-file env.list -v /Users/yukailuo/mongo-bigquery-connector/data:/app/data mongo-bigquery-connector
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

- Rename key file to `bigquery_credential.json`

- Move the key file to `data` directory of this repository.

For example:

```Shell
mv <path_to_key_file>/bigquery_credential.json <path_to_this_repository>/data
```

- Set the environment variable **_GOOGLE_APPLICATION_CREDENTIALS_** to the path to the key file.

For example:

```
export GOOGLE_APPLICATION_CREDENTIALS="<path_to_the_repository>/data/bigquery_credential.json"
```

##### 3.2. BigQuery

Set **_BIGQUERY_PROJECT_ID_** to the target BigQuery project.

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

### 5. Running the script

Run:

```
$ node stream_main.js
```

## Authors

- **Yukai Luo** - _Initial work_ -

## Acknowledgments

Big thanks to Puneet and everyone who helped me on this small project.
I'm really grateful for your time and help!
