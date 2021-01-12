
import mongoose, { Connection } from 'mongoose'
import Logger from '@utils/Logger'
import InitializeDatabase from '@helpers/InitializeDatabase'
import { readdirSync } from 'fs'
import path from 'path'
import AppError from '@utils/AppError'

// import Model Schemas Mongoose
readdirSync(path.join(__dirname, '../models')).forEach((fileName) => {
  const fullPath = path.join(__dirname, '../models', fileName)
  require(fullPath)
})

export default class Database {
  private datanaseURI: string;
  private conn: Connection;
  constructor (databaseUrl:string = null) {
    this.datanaseURI = databaseUrl || process.env.MONGO_DB

    mongoose.Promise = global.Promise
    mongoose.set('debug', (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'))
    mongoose.set('useCreateIndex', true)
  }

  public async connect (): Promise<void> {
    try {
      await mongoose.connect(this.datanaseURI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      })
      Logger.info('Database connected!')
      this.conn = mongoose.connection
      await new InitializeDatabase().createDefaultUser()
    } catch (error) {
      Logger.error('')
      Logger.error(`Error connection DB: ${error}`)
    }
  }

  public connection (): Connection {
    if (!this.conn) { throw new AppError('Database not connected!', 500) }

    return this.conn
  }
}
