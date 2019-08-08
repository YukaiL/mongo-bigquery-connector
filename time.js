//Functions concerning time logging and formatting
//========
const { BigQuery } = require('@google-cloud/bigquery')
const bigquery = new BigQuery()
var datasetID = require('./stream_main.js').datasetId
console.log('In time.js file, the datasetId: "' + datasetID + '" is passed in.')
const timeTableID = 'ingestionTime'
const localTimeFileID = 'lastUpdateTime.json'

module.exports = {
  //Get the last ingestion time from BigQuery
  getLastUpdateTime: async function() {
    const query =
      `SELECT lastUpdateTime
        FROM \`playground-243019.` +
      datasetID +
      `.` +
      timeTableID +
      `\`
        ORDER BY lastUpdateTime DESC
        LIMIT 1`

    const options = {
      query: query,
      location: 'US'
    }

    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options)

    // Wait for the query to finish
    const row = await job.getQueryResults()
    const lastUpdateTime = row[0][0].lastUpdateTime
    return lastUpdateTime
  },

  //Update the current ingestion time to BigQuery
  update: async function() {
    // Load data from a local file into the table
    const [job] = await bigquery
      .dataset(datasetID)
      .table(timeTableID)
      .load(localTimeFileID)

    console.log(`Time updated.`)

    // Check the job's status for errors
    const errors = job.status.errors
    if (errors && errors.length > 0) {
      throw errors
    }
  },

  //Format Unix time to human readable format
  formatTime: function(UnixTimestamp) {
    var date = new Date(UnixTimestamp)
    return date.toLocaleString()
  },

  insertIngestionTime: function(timeNow, batch) {
    batch.ingestionTime = timeNow
  }
}
