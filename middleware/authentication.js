const user = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const authenticationMiddleware = async (req, res, next) => {
    const auth = req.headers.authorization

    if (auth && !auth.startsWith('Bearer null')) {
        const token = auth.split(' ')[1]

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = { userId: decoded.userId, name: decoded.name }
            next()
        } catch (err) {
            throw new UnauthenticatedError('token verification failed not authorised to access info')
        }

    }
    else
        throw new UnauthenticatedError('Empty Credentials, No token')
}
module.exports = authenticationMiddleware;