'use strict'

const Boom = require('@hapi/boom')

/**
 * Format the error response and log it
 * @param {String} errorName
 * @param {Object|String} error
 * @param {Boolean} isWarning
 * @returns {Object}
 */
const formatErrorResponse = (errorName, error, isWarning = false) => {
  if (isWarning) {
    console.warn(error)
  } else {
    console.error(error)
  }

  const message = error.message || error
  return (
    (Boom[errorName] && Boom[errorName](message)) || {
      code: 500,
      error: message
    }
  )
}

module.exports = {
  formatErrorResponse
}
