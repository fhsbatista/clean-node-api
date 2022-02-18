import { Collection } from 'mongodb'
import { MongoHelper } from '../mongodb/helpers/mongo-helper'
import { LogMongoRepository } from './log'

describe('Log Mongo Repository ', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should create an error log on success', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
