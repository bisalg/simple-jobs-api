const mongoose = require('mongoose')

const connectDB = (uri) => {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }).then(() => console.log('connected to DB...'))
}

module.exports = connectDB
