const jwtPlugin = require('hapi-auth-jwt2').plugin
const JWT_KEY = process.env.SECRET_KEY || 'NeverShareYourSecret'
const Boom = require('@hapi/boom')
const UserModel = require('../models/User')
const ObjectId = require('mongoose').Types.ObjectId

var validate = async (credentials) => {
  console.log(credentials)
  const email = credentials.email
  const id = credentials._id

  if (!email || !id) {
    return Boom.unauthorized()
  }

  const user = await UserModel.findOne({ email, _id: ObjectId(id) })

  if (!user) {
    return Boom.unauthorized()
  }

  return {
    isValid: true
  }
}

exports.configureAuth = async (server) => {
  await server.register(jwtPlugin)
  server.auth.strategy('admin', 'jwt', {
    key: JWT_KEY,
    validate,
    verifyOptions: { algorithms: ['HS256'] }
  })

  // Default all routes to require JWT and opt out for public routes
  server.auth.default('admin')
}
