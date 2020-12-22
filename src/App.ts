import 'reflect-metadata'
import { config } from 'dotenv'
import CheckVersion from '@config/CheckVersion'
import Database from '@config/Database'
import express, { Application, NextFunction, Request, Response } from 'express'
import { Server } from 'http'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compress from 'compression'
import methodOverride from 'method-override'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import Logger from '@utils/Logger'
import { readFileSync } from 'fs'
import path from 'path'

import { useExpressServer } from 'routing-controllers'
import { Connection } from 'mongoose'
import AppError from '@utils/AppError'

export default class App {
  private app: Application;
  private server: Server;
  private port: Number;
  private database: Database;

  constructor () {
    process.env.NODE_ENV = process.env.NODE_ENV.trim()
    config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : process.env.NODE_ENV === 'test' ? '.env.test' : '.env' })
    this.checkEnvironment()
  }

  private checkEnvironment (): void {
    const checkVersion: CheckVersion = new CheckVersion()
    checkVersion.execute()
  }

  private async initDB (): Promise<void> {
    this.database = new Database()
    await this.database.connect()
  }

  private middlewares (): void {
    // body-parser
    this.app.use(bodyParser.urlencoded({ extended: true }))
    this.app.use(bodyParser.json())
    this.app.use(cookieParser())
    this.app.use(compress())
    this.app.use(methodOverride())
    // secure apps by setting various HTTP headers
    this.app.use(helmet())
    // enable CORS - Cross Origin Resource Sharing
    this.app.use(cors())

    // use morgan to log requests to the console
    if (process.env.NODE_ENV !== 'production') {
      this.app.use(morgan('dev'))
    }

    this.app.use((_request: Request, response: Response, next: NextFunction) => {
      response.header('Access-Control-Allow-Origin', '*')
      response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
      response.header('Access-Control-Allow-Headers', 'X-Requested-With, content-type, authorization')
      response.header('Access-Control-Allow-Credentials', 'true')
      next()
    })
  }

  private swaggerDocs (): void {
    const swaggerFile: any = JSON.parse(readFileSync(path.join(__dirname, './swagger/swagger.json'), 'utf8'))
    this.app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
  }

  private routes (): void {
    useExpressServer(this.app, {
      routePrefix: '/api/v1',
      cors: true,
      defaultErrorHandler: false,
      classTransformer: false,
      // eslint-disable-next-line node/no-path-concat
      controllers: [__dirname + '/controllers/*Controller.*'],
      // eslint-disable-next-line node/no-path-concat
      middlewares: [__dirname + '/middlewares/*Middleware.*']
    })
  }

  public async initialize (): Promise<void> {
    await this.initDB()
    this.app = express()
    this.middlewares()
    this.swaggerDocs()
    this.routes()
  }

  public async listen (): Promise<void> {
    this.port = Number((process.env.PORT || process.env.API_PORT || 3000))
    this.server = this.getApplication().listen(this.port, () => {
      Logger.info('Server started on port: ', this.port)
    })
  }

  public getApplication (): Application {
    if (!this.app) { throw new AppError('Application not initialized!', 500) }
    return this.app
  }

  public getServer (): Server {
    if (!this.server) { throw new AppError('Server is not listening', 500) }
    return this.server
  }

  public getDBConn (): Connection {
    return this.database.connection()
  }
}
