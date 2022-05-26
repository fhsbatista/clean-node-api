import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

let surveysCollection

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    surveysCollection = await MongoHelper.getCollection('surveys')
    await surveysCollection.deleteMany({})
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
  })
})
