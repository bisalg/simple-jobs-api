const User_Model = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {

    const user = await User_Model.create(req.body)
    const token = user.getToken()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, _id: user._id, token })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) throw new BadRequestError('Incomplete Credentials, Please provide name and email')

    const user = await User_Model.findOne({ email })

    if (!user) throw new UnauthenticatedError('Invalid Credentials')

    const password_match = await user.comparePassword(password)

    if (!password_match) throw new UnauthenticatedError('Invalid Credentials')

    const token = user.getToken()
    res.status(StatusCodes.OK).json({ user: { name: user.name }, _id: user._id, token })
}

module.exports = { register, login }