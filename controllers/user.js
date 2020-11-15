const UserModel = require('../models/User')
const Boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const JWT_KEY = process.env.SECRET_KEY || 'NeverShareYourSecret'

class User {
  /**
   * Create a user
   */
  async createUser(request, h) {
    try {
      const payload = request.payload

      // Check if user with same email already exists
      const userFound = await UserModel.findOne(
        { email: payload.email },
        '_id'
      ).lean()

      // Error if user email already exists
      if (userFound) {
        return Boom.conflict('User already register with this email')
      }

      // Error if password is too short
      if (payload.password.length < 8) {
        return Boom.badRequest('Password too short')
      }

      // Hash password that will be saved in DB
      const salt = bcrypt.genSaltSync(10)
      const hashedPwd = bcrypt.hashSync(payload.password, salt)
      payload.password = hashedPwd

      // Create the user
      const user = await UserModel.create(payload)

      // Generate the user JWT token
      const token = jwt.sign({ _id: user._id, email: user.email }, JWT_KEY, {
        algorithms: ['HS256']
      })

      return {
        code: 201,
        data: {
          token
        }
      }
    } catch (error) {
      console.error('Error createUser =>', error)
      throw new Error(error.message || error)
    }
  }

  /**
   * Get a user
   */
  async getUser(request, h) {
    console.log(request.auth.credentials)

    try {
      return await UserModel.findById(request.params.id)
    } catch (error) {
      console.error('Error getUser =>', error)
      throw new Error(error.message || error)
    }
  }
}

module.exports = new User()
