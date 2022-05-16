import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { SurveysMongoRepository } from './surveys-mongo-repository'

let surveysCollection: Collection

describe('Surveys Mongo Repository', () => {
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

  const makeSut = (): SurveysMongoRepository => {
    return new SurveysMongoRepository()
  }

  test('Should add a survey', async () => {
    const sut = makeSut()
    await sut.add({
      question: 'any_question',
      answers: [{
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        answer: 'any_other_answer'
      }]
    })
    const survey = await surveysCollection.findOne({ question: 'any_question' })
    expect(survey).toBeTruthy()
  })
})
