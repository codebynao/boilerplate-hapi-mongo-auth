require('dotenv').config()
const Hapi = require('@hapi/hapi')
const mongoose = require('mongoose')
const { configureAuth } = require('./utils/auth')

// Init server
const init = async () => {
  const server = Hapi.Server({
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 3000,
    routes: {
      cors: true
    }
  })
  await configureAuth(server)

  // Init DB connection
  require('./utils/dbConnection')(mongoose, server)

  // Import routes
  server.route({
    path: '/',
    method: 'GET',
    handler: function (request, h) {
      return 'Hello from Taskee API'
    }
  })

  // ROUTING PLUGIN
  await server.register([require('./routes/auth'), require('./routes/user')])

  await server.start()
  console.log(`Server running at: ${server.info.uri}`)
}

init()
