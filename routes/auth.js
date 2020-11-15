'use strict'

const authController = require('../controllers/auth')
const Joi = require('@hapi/joi')

const Auth = {
  name: 'Auth',
  version: '1.0.0',

  register: async (server, options) => {
    server.route([
      {
        method: 'POST',
        path: '/auth/login',
        config: {
          auth: false,
          validate: {
            payload: Joi.object({
              email: Joi.string().email().required(),
              password: Joi.string().required()
            })
          }
        },
        handler: async (request) => {
          return authController.login(request)
        }
      }
    ])
  }
}
module.exports = Auth
