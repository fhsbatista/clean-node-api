import { MongoClient } from 'mongodb'

export const MongoHelper = {
  client: null as MongoClient,
  async connect (url: string): Promise<void> {
    this.client = await MongoClient.connect(process.env.mongoURLEnvName)
  },
  async disconnect (): Promise<void> {
    await this.client.close()
  }
}
