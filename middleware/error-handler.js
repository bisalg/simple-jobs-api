const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  const CustomError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'something went wrong'
  }
  // if (err instanceof CustomAPIError) {
  //   console.log(err)
  //   return res.status(err.statusCode).json({ })
  // }
  if (err.name === 'ValidationError') {
    CustomError.msg = Object.values(err.errors).map(item => item.message).join(',')
    CustomError.statusCode = 400
  }
  if (err.code && err.code === 11000) {
    CustomError.msg = `duplicate value entered for ${Object.keys(err.keyValue)}, please choose another value`
    CustomError.statusCode = 400
  }
  if (err.name === 'CastError') {
    CustomError.msg = `no item found with id: ${err.value}`
    CustomError.statusCode = 404
  }
  res.status(CustomError.statusCode).json({ err_msg: CustomError.msg })
}

module.exports = errorHandlerMiddleware
