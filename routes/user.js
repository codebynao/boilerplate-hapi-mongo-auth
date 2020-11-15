'use strict'

const UserController = require('../controllers/user')
const Joi = require('@hapi/joi')

const User = {
  name: 'User',
  version: '1.0.0',

  register: async (server, options) => {
    server.route([
      {
        method: 'POST',
        path: '/user',
        config: {
          auth: false,
          validate: {
            payload: Joi.object({
              firstName: Joi.string().required(),
              lastName: Joi.string().required(),
              email: Joi.string().required(),
              password: Joi.string().required()
            })
          }
        },
        handler: async (req, h) => {
          return await UserController.createUser(req, h)
        }
      },
      {
        method: 'GET',
        path: '/user/{id}',
        config: {
          validate: {
            params: Joi.object({
              id: Joi.string().required()
            })
          }
        },
        handler: async (req, h) => {
          return await UserController.getUser(req, h)
        }
      }
    ])
  }
}
module.exports = User
