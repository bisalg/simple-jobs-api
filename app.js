require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const authrouter = require('./routes/auth')
const jobsrouter = require('./routes/jobs')
const ConnectDB = require('./db/connect')
const authenticationMiddleware = require('./middleware/authentication')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const ratelimiter = require('express-rate-limit')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)
app.use(ratelimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
// extra packages
app.get('/', (req, res) => {
  res.send('jobs api')
})
// routes
app.use('/api/v1/auth', authrouter)
app.use('/api/v1/jobs', authenticationMiddleware, jobsrouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await ConnectDB(process.env.MONGO_URI)
    app.listen(port, console.log(`Server is listening on port ${port}...`))
  } catch (error) {
    console.log(error)
  }
}

start()
