import 'reflect-metadata'
import { config } from 'dotenv'
import Logger from '@utils/Logger'
import Database from '@config/Database'
import CheckVersion from '@config/CheckVersion'
import App from './App'

async function bootstrap () {
  config()
  process.env.NODE_ENV = process.env.NODE_ENV.trim()
  const checkVersion: CheckVersion = new CheckVersion()
  try {
    checkVersion.execute()
    Logger.info('Starting API server...')
    const database: Database = new Database()
    await database.connect()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const app = new App()

    Logger.info('Application started!')
  } catch (error) {
    Logger.error(`Starting application. Erro: ${error.message}`, error)
  }
}

// inicializa app
bootstrap()
