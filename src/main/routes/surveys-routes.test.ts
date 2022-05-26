import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let surveysCollection
let accountCollection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /surveys] ', () => {
    test('Should return 403 on add_survey without access token', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: [{
            answer: 'answer 1',
            image: 'http://image-path.com'
          },
          {
            answer: 'answer 2'
          }]
        })
        .expect(403)
    })

    test('Should return 204 on add_survey with valid access token', async () => {
      const { insertedId } = await accountCollection.insertOne({
        name: 'Fernando Batista',
        email: 'fernando.batista@fbatista.com',
        password: 'anypassword',
        role: 'admin'
      })
      const accessToken = sign({ insertedId }, env.jwtSecret)
      accountCollection.update({ _id: insertedId }, { $set: { accessToken: accessToken } })
      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'Question',
          answers: [{
            answer: 'answer 1',
            image: 'http://image-path.com'
          },
          {
            answer: 'answer 2'
          }]
        })
        .expect(204)
    })
  })
})
