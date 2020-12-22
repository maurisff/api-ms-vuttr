import { Application } from 'express'
import { Connection } from 'mongoose'
import request from 'supertest'
import App from '../../src/App'
import Setup from '../setup/Setup'

import { IUser } from '../../src/models/user.model'
import IUserSession from '../../src/interfaces/IUserSession'
let db: Connection
let application: App
let app: Application
let auth: IUserSession

describe('Session Controllers', () => {
  application = new App()

  beforeAll(async () => {
    await application.initialize()
    app = application.getApplication()
    const response = await request(app).post('/api/v1/session/authentication').send().auth('admin', '123456', { type: 'basic' })
    auth = {
      id: response.body.id,
      login: response.body.login,
      name: response.body.name,
      token: response.body.token
    }
    db = application.getDBConn()
    db.on('open', () => {
      console.log('Database starts successfully')
    })
  })

  beforeEach(() => {
    if (db.collection('users').countDocuments()) {
      return db.collection('users').deleteMany({})
    }
  })

  afterAll(() => {
    return db.close()
  })

  it('should authenticate a new user!!', async () => {
    const session: IUser = await Setup.attrs('Session')
    const created = await request(app).post('/api/v1/user').send(session).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const response = await request(app).post('/api/v1/session/authentication').send().auth(session.login, session.password, { type: 'basic' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: created.body._id,
      login: created.body.login,
      name: created.body.name,
      token: response.body.token
    })

    expect(response.headers.authorization).toBe(response.body.token)
  })

  it('should require authorization in the header', async () => {
    const session: IUser = await Setup.attrs('Session')
    const created = await request(app).post('/api/v1/user').send(session).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const response = await request(app).post('/api/v1/session/authentication').send()

    expect(response.status).toBe(401)
    expect(response.body).toMatchObject({
      status: 'error',
      message: 'Missing Authorization Header'
    })
  })

  it('should validate invalid credentials', async () => {
    const session: IUser = await Setup.attrs('Session')
    const created = await request(app).post('/api/v1/user').send(session).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const response = await request(app).post('/api/v1/session/authentication').send().auth(session.login, `Error:${session.password}`, { type: 'basic' })

    expect(response.status).toBe(401)
    expect(response.body).toMatchObject({
      status: 'error',
      message: 'Invalid credentials'
    })
  })
})
