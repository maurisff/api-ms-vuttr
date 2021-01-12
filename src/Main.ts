
import Logger from '@utils/Logger'
import App from './App'

async function bootstrap () {
  try {
    Logger.info('Starting API server...')
    const app = new App()
    await app.initialize()
    await app.listen()
    Logger.info('Application started!')
  } catch (error) {
    Logger.error(`Starting application. Erro: ${error.message}`, error)
  }
}

// inicializa app
bootstrap()
