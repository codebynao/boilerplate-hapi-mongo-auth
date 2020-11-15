'use strict'

const UserModel = require('../models/User')
const Boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const JWT_KEY = process.env.SECRET_KEY || 'NeverShareYourSecret'
const bcrypt = require('bcrypt-nodejs')

class Auth {
  async login(req, h) {
    try {
      const { email, password } = req.payload

      const user = await UserModel.findOne({
        email
      })

      if (!user || !bcrypt.compareSync(password, user.password)) {
        return Boom.unauthorized()
      }

      const token = jwt.sign({ email }, JWT_KEY, { algorithm: 'HS256' })

      return { code: 200, token, userId: user.id_user }
    } catch (error) {
      return Boom.internal()
    }
  }
}

module.exports = new Auth()
