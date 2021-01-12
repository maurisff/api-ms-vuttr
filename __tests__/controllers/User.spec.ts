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

describe('User Controllers', () => {
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

  it('should create a user successfully!!', async () => {
    const user: IUser = await Setup.attrs('User')
    const created = await request(app).post('/api/v1/user').send(user).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    expect(created.body).toMatchObject({
      _id: created.body._id,
      login: user.login.toLocaleLowerCase(),
      name: user.name
    })
  })

  it('should return all users', async () => {
    const user: IUser = await Setup.attrs('User')
    const created = await request(app).post('/api/v1/user').send(user).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const user2: IUser = await Setup.attrs('User2')
    const created2 = await request(app).post('/api/v1/user').send(user2).auth(auth.token, { type: 'bearer' })
    expect(created2.status).toBe(201)

    const response = await request(app).get('/api/v1/user').send().auth(auth.token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject(
      response.body.map(object => object)
    )
  })

  it('should return the filtered user', async () => {
    const user: IUser = await Setup.attrs('User')
    const created = await request(app).post('/api/v1/user').send(user).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const user2: IUser = await Setup.attrs('User2')
    const created2 = await request(app).post('/api/v1/user').send(user2).auth(auth.token, { type: 'bearer' })
    expect(created2.status).toBe(201)

    const response = await request(app).get('/api/v1/user').send().query({ q: user2.login }).auth(auth.token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject(
      [created2.body]
    )
  })

  it('should not return the filtered user', async () => {
    const user: IUser = await Setup.attrs('User')
    const created = await request(app).post('/api/v1/user').send(user).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const user2: IUser = await Setup.attrs('User2')
    const created2 = await request(app).post('/api/v1/user').send(user2).auth(auth.token, { type: 'bearer' })
    expect(created2.status).toBe(201)

    const response = await request(app).get('/api/v1/user').send().query({ q: '18999819' }).auth(auth.token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject([])
  })
})
