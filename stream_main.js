//  Run the script to stream data from mongodb to Google Bigquery.
//  ===========================

const { BigQuery } = require('@google-cloud/bigquery')
// TODO:
/*
Before start, uncomment the following commands to generate a service account key, 
see https://cloud.google.com/docs/authentication/production#obtaining_and_providing_service_account_credentials_manually
*/

console.log(
  '--------------------------DEBUGGING INFO--------------------------'
)
const GOOGLE_APPLICATION_CREDENTIALS =
  process.env.GOOGLE_APPLICATION_CREDENTIALS
const url = process.env.MONGO_URL
const datasetId = process.env.BIGQUERY_DATASET
console.log('Looking for GOOGLE_APPLICATION_CREDENTIALS key file path: ')
console.log('found: ' + GOOGLE_APPLICATION_CREDENTIALS)
console.log('Looking for datasetId: ')
console.log('found: ' + datasetId)
console.log(
  '------------------------------------------------------------------'
)

//export dataset name to time.js helper file
module.exports = {
  datasetId
}

const path = require('path')
const dataPath = './data'
const bigquery = new BigQuery()
const dataset = bigquery.dataset(datasetId)
const MongoClient = require('mongodb').MongoClient
const fs = require('fs')
const trans = require('./transformation_fn.js')
const time = require('./time.js')

var db
var dbo
//get last update time to avoid duplicates in BQ.
var lastUpdateTime
//record time for current ingestion.
var timeNow = Date.now()
//Save the record locally.
fs.writeFileSync('lastUpdateTime.json', '{"lastUpdateTime": ' + timeNow + '}')

// Main
ifDatasetExists(dataset)
  .then(getDataset)
  .then(() => time.getLastUpdateTime())
  .then(recordLastUpdateTime)
  .then(() =>
    MongoClient.connect(url, {
      useNewUrlParser: true
    })
  )
  .then(getDataBase)
  .then(() => enumerate(dataPath + path.sep + 'query'))
  .then(loopCollections)
  .then(() => time.update())
  .then(() => db.close())
  .catch(error => console.log(error))

// Return true if the dataset exists.
function ifDatasetExists(dataset) {
  return dataset.exists()
}

// If dataset exists, do nothing. Else, create the dataset.
async function getDataset(existsArr) {
  var exists = existsArr[0]
  if (!exists) {
    await createDataset(dataset)
  } else {
    console.log('Start updating ' + dataset.id + ' dataset.')
  }
}

// Creates a new dataset named "datasetId".
async function createDataset(dataset) {
  // Specify the geographic location where the dataset should reside
  const datasetOptions = {
    location: 'US'
  }

  // Create a new dataset
  await bigquery.createDataset(dataset.id, datasetOptions)
  console.log(dataset.id + ' dataset created.')

  // Create ingestionTime table
  var tableId = 'ingestionTime'
  var ingestionTimeSchema = [
    { name: 'lastUpdateTime', type: 'INTEGER', mode: 'NULLABLE' }
  ]

  const ingestionTimeOptions = {
    schema: ingestionTimeSchema,
    location: 'US'
  }

  await dataset.createTable(tableId, ingestionTimeOptions)

  // Initialize ingestionTime table
  const row = [{ lastUpdateTime: 0 }]

  // Insert data into a table
  await dataset.table(tableId).insert(row)
  console.log(`ingestionTime table initialized`)
}

// Initiate database.
function getDataBase(database) {
  db = database
  dbo = database.db('harness')
}

// return an array of query file paths
function enumerate(dir) {
  jsonFiles = []
  console.log('Enumerating through ' + dir)
  fs.readdirSync(dir).forEach(function(file) {
    var stat
    stat = fs.statSync('' + dir + path.sep + file)
    if (file.split('.').pop() === 'json') {
      return jsonFiles.push('' + dir + path.sep + file)
    }
  })
  return jsonFiles
}

// Loop through all query files.
async function loopCollections(colls) {
  for (var i = 0; i < colls.length; i++) {
    var queryFile = JSON.parse(fs.readFileSync(colls[i]))
    await ifTableExists(queryFile)
      .then(exists => getTable(exists, queryFile))
      .then(() => streamData(queryFile))
      .then(() => sleep(2000))
      .catch(error => console.log(error))
  }
}

// Return true if the table exists.
function ifTableExists(queryFile) {
  return new Promise((res, rej) => {
    var tableName = queryFile.target_table
    var table = dataset.table(tableName)
    table.exists(function(err, exists) {
      if (err) {
        rej(err)
      } else {
        res(exists)
      }
    })
  })
}

// If table exists, do nothing. Else, create the table.
async function getTable(exists, queryFile) {
  var targetTable = queryFile.target_table
  if (!exists) {
    await createTable(targetTable)
    console.log(targetTable + ' table created.')
  } else {
    console.log('Start updating ' + targetTable + ' data.')
  }
}

// Create a table.
async function createTable(tableID) {
  const schema = JSON.parse(
    fs.readFileSync(
      dataPath + path.sep + 'schema' + path.sep + tableID + '_BQschema.json'
    )
  )
  //  For all options, see https:// cloud.google.com/bigquery/docs/reference/v2/tables#resource
  const options = {
    schema: schema,
    timePartitioning: {
      type: 'DAY'
    },
    location: 'US'
  }
  //  Create a new table in the dataset
  await dataset.createTable(tableID, options)
}

/*
Stream data to target table according to query.
    Event collections are updated with new entries.
    Snapshot collections are streamed again entirely.
*/
function streamData(queryFile) {
  return new Promise((res, rej) => {
    // Get the query.
    var query = queryFile.query
    var sourceTable = queryFile.source_table
    var targetTable = queryFile.target_table
    var isSnapshot = queryFile.isSnapshot
    console.log('isSnapshot: ' + isSnapshot)
    if (!isSnapshot) {
      // It's event data.
      console.log('Time now is: ' + time.formatTime(timeNow))
      console.log('Last update time: ' + time.formatTime(lastUpdateTime))
      // Filter out data that is already streamed previously
      var queryNew = {
        $match: {
          createdAt: { $gt: lastUpdateTime }
        }
      }
      // Update query with time filter.
      query.push(queryNew)
    }
    // Start streaming process.
    var strm = dbo
      .collection(sourceTable)
      .aggregate(query)
      .stream()
    strm.on('data', batch => {
      // get rid of collection sourceTable at the end.
      if (batch != sourceTable) {
        // check for illegal keys
        trans.stringPack(sourceTable, batch)
        time.insertIngestionTime(timeNow, batch)
        insertRowsAsStream(targetTable, batch)
      }
    })

    strm.on('end', () => {
      // Wait some time for last few sets of data.
      sleep(2000)
      console.log(targetTable + ' table finishing updating.')
      res(targetTable)
    })
  })
}

// Streaming function
async function insertRowsAsStream(tableID, rows) {
  await dataset
    .table(tableID)
    .insert([rows])
    .catch(error => {
      // For debugging purpose
      if (error.name === 'PartialFailureError') {
        console.log('----------------------ERROR------------------------')
        // console.log(error)
        // console.log(rows)
        console.log('error response : ')
        console.log(error.response)
        console.log('error response insertError: ')
        console.log(error.response.insertErrors)
        console.log(error.response.insertErrors[0].errors)
        console.log(error.errors[0].row._id)
        console.log('----------------------------------------------')
        // throw error;
      } else {
        console.log('Error occurs when streaming ' + tableID + ' data.')
        console.log('----------------------ERROR------------------------')
        throw error
      }
    })
}

function sleep(ms) {
  return new Promise(res => {
    setTimeout(res, ms)
  })
}

// Save lastUpdateTime gotten from BigQuery as variable
function recordLastUpdateTime(UnixTimeStamp) {
  lastUpdateTime = UnixTimeStamp
}
