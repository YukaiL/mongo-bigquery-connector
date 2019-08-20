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
var countBefore = 0
var countAfter = 0
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
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  )
  .then(getDataBase)
  .then(() => enumerate(dataPath + path.sep + 'query'))
  .then(loopCollections)
  //.then(() => time.update())
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
  // Get data from past 24 hours.
  const row = [{ lastUpdateTime: timeNow - 86400000 }]

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

var streamedCount = 0
var totalStreamed = 0

async function streamData(queryFile) {
  // Get the query.
  streamedCount = 0
  totalStreamed = 0
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
  console.log('Start streaming count: ' + streamedCount)
  query.push({ $skip: 0 })
  await toBigQuery(query, sourceTable, targetTable)
  console.log('This batch count: ' + streamedCount)
  while (streamedCount === 100) {
    query.pop()
    query.pop()
    query.push({ $skip: totalStreamed })
    await toBigQuery(query, sourceTable, targetTable)
  }
  console.log('---------------------------------------------------------------')
  return
}

async function toBigQuery(query, sourceTable, targetTable) {
  const batch = await dbo
    .collection(sourceTable)
    .aggregate(query)
    .limit(100)
    .toArray()

  // Avoid empty ingestions
  if (batch.length === 0) {
    return
  }

  for (var i = 0; i < batch.length; i++) {
    trans.stringPack(sourceTable, batch[i])
    time.insertIngestionTime(timeNow, batch[i])
  }
  await insertRowsAsStream(targetTable, batch)
  streamedCount = batch.length
  totalStreamed += batch.length
  console.log('This ' + targetTable + ' batch count: ' + streamedCount)
  console.log('Total streamed for ' + targetTable + ' data: ' + totalStreamed)

  // .then(batch => {
  //   streamedCount = batch.length
  //   totalStreamed += batch.length
  //   for (var i = 0; i < batch.length; i++) {
  //     trans.stringPack(sourceTable, batch[i])
  //     time.insertIngestionTime(timeNow, batch[i])
  //   }
  //   await insertRowsAsStream(targetTable, batch)
  // })
}

/*
  streamedCount = 0
  strm.on('data', batch => {
    // get rid of collection sourceTable at the end.
    if (batch != sourceTable) {
      // check for illegal keys
      trans.stringPack(sourceTable, batch)
      time.insertIngestionTime(timeNow, batch)
      countBefore += 1
      console.log('Current buffer before 1 insertion: ####' + countBefore)
      insertRowsAsStream(targetTable, batch)
      console.log('Current buffer after 1 insertion: ' + countAfter)
      //tryLimitStream
      streamedCount += 1
      if (global.gc) {
        console.log(
          'GC is running: ' +
            Math.round(process.memoryUsage().rss / (1024 * 1024)) +
            'MB'
        )
      }
    }
  })

  strm.on('end', () => {
    console.log(
      '------------------------------------------------------------------------------'
    )
    console.log(targetTable + ' table finishing updating.')
    res(targetTable)
  })
}
*/

// Streaming function
async function insertRowsAsStream(tableID, rows) {
  await dataset
    .table(tableID)
    .insert(rows)
    .catch(error => {
      // For debugging purpose
      console.log('Error occurs when streaming ' + tableID + ' data.')
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
      } else {
        console.log('----------------------ERROR------------------------')
        console.log('Timestamp is: ' + Date.now())
        console.log('Error name is: ' + error.name)
        console.log(error.stack)
        console.log(error)
      }
    })
  countAfter += 1
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

function scheduleGc() {
  if (!global.gc) {
    console.log('Garbage collection is not exposed')
    return
  }

  // schedule next gc within a random interval (e.g. 15-45 minutes)
  // tweak this based on your app's memory usage
  var nextSeconds = 5

  setTimeout(function() {
    global.gc()
    console.log('Manual gc', process.memoryUsage())
    scheduleGc()
  }, nextSeconds * 1000)
}
