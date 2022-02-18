const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const photographerRouter = require('./routes/photographer.router')

const app = express()
const apiPort = 3000


app.use(cors())
app.use(bodyParser.json())
app.use('/api', photographerRouter)

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(apiPort, () => {
  console.log(`Server runing on port ${apiPort}`)
})
