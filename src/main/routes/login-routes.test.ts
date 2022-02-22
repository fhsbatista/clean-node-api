import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import bcrypy from 'bcrypt'

let accountCollection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /signup] ', () => {
    test('Should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Fernando Batista',
          email: 'fernando.batista@fbatista.com',
          password: 'f3rnando',
          passwordConfirmation: 'f3rnando'
        })
        .expect(200)
    })
  })

  describe('POST /login] ', () => {
    test('Should return 200 on login', async () => {
      const hashedPassword = await bcrypy.hash('f3rnando', 12)
      await accountCollection.insertOne({
        name: 'Fernando Batista',
        email: 'fernando.batista@fbatista.com',
        password: hashedPassword
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'fernando.batista@fbatista.com',
          password: 'f3rnando'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      const hashedPassword = await bcrypy.hash('f3rnando', 12)
      await accountCollection.insertOne({
        name: 'Fernando Batista',
        email: 'fernando.batista@fbatista.com',
        password: hashedPassword
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'fernando.batista@fbatista.com',
          password: 'f3rnando'
        })
        .expect(200)
    })
  })
})
