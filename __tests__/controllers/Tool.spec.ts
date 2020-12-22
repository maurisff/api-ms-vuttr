import { Application } from 'express'
import { Connection } from 'mongoose'
import request from 'supertest'
import App from '../../src/App'
import Setup from '../setup/Setup'

import { ITool } from '../../src/models/tool.model'
import IUserSession from '../../src/interfaces/IUserSession'
let db: Connection
let application: App
let app: Application
let auth: IUserSession

describe('Tool Controllers', () => {
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
    if (db.collection('tools').countDocuments()) {
      return db.collection('tools').deleteMany({})
    }
  })

  afterAll(() => {
    return db.close()
  })

  it('should create a user successfully!!', async () => {
    const tool: ITool = await Setup.attrs('Tool')
    const created = await request(app).post('/api/v1/tools').send(tool).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    expect(created.body).toMatchObject({
      ...tool,
      _id: created.body._id
    })
  })

  it('should not create a user without mandatory fields', async () => {
    const created = await request(app).post('/api/v1/tools').send({}).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(400)

    expect(created.body).toMatchObject({
      status: created.body.status,
      message: created.body.message
    })
  })

  it('should return all users', async () => {
    const tool: ITool = await Setup.attrs('Tool')
    const created = await request(app).post('/api/v1/tools').send(tool).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const tool2: ITool = await Setup.attrs('Tool2')
    const created2 = await request(app).post('/api/v1/tools').send(tool2).auth(auth.token, { type: 'bearer' })
    expect(created2.status).toBe(201)

    const response = await request(app).get('/api/v1/tools').send().auth(auth.token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject(
      response.body.map(object => object)
    )
  })

  it('should return the filtered user by text', async () => {
    const tool: ITool = await Setup.attrs('Tool')
    const created = await request(app).post('/api/v1/tools').send(tool).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const tool2: ITool = await Setup.attrs('Tool2')
    const created2 = await request(app).post('/api/v1/tools').send(tool2).auth(auth.token, { type: 'bearer' })
    expect(created2.status).toBe(201)

    const response = await request(app).get('/api/v1/tools').send().query({ q: tool2.title }).auth(auth.token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject(
      [created2.body]
    )
  })

  it('should return the filtered user by tag', async () => {
    const tool: ITool = await Setup.attrs('Tool')
    const created = await request(app).post('/api/v1/tools').send(tool).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const tool2: ITool = await Setup.attrs('Tool2')
    const created2 = await request(app).post('/api/v1/tools').send(tool2).auth(auth.token, { type: 'bearer' })
    expect(created2.status).toBe(201)

    const response = await request(app).get('/api/v1/tools').send().query({ tag: 'typescript' }).auth(auth.token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject(
      [created.body]
    )
  })

  it('should not return the filtered user', async () => {
    const tool: ITool = await Setup.attrs('Tool')
    const created = await request(app).post('/api/v1/tools').send(tool).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const tool2: ITool = await Setup.attrs('Tool2')
    const created2 = await request(app).post('/api/v1/tools').send(tool2).auth(auth.token, { type: 'bearer' })
    expect(created2.status).toBe(201)

    const response = await request(app).get('/api/v1/tools').send().query({ q: '18999819Texot' }).auth(auth.token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject([])
  })

  it('Should remove tool!!', async () => {
    const tool: ITool = await Setup.attrs('Tool')
    const created = await request(app).post('/api/v1/tools').send(tool).auth(auth.token, { type: 'bearer' })
    expect(created.status).toBe(201)

    const deleted = await request(app).delete(`/api/v1/tools/${created.body._id}`).send().auth(auth.token, { type: 'bearer' })
    expect(deleted.status).toBe(204)
    expect(deleted.body).toMatchObject({})

    const response = await request(app).get('/api/v1/tools').send().query({ q: tool.title }).auth(auth.token, { type: 'bearer' })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject([])
  })
})
