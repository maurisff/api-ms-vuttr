'use strict'
import { configure, getLogger } from 'log4js'

configure({
  appenders: {
    app: {
      type: 'file',
      filename: './logs/app.log',
      maxLogSize: 20000,
      layout: {
        type: 'pattern',
        pattern: '%d{dd/MM/yyyy hh:mm:ss} %-5p- %m'
      },
      numBackups: 5,
      compress: true
    },
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%d{dd/MM/yyyy hh:mm:ss} %-5p- %m'
      }
    }
  },
  categories: {
    default: { appenders: ['app', 'console'], level: 'debug' }
  }
})
export default getLogger()
