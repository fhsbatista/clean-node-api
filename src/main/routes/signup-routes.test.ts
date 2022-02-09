import request from 'supertest'
import app from '../config/app'

describe('SignUp Routes', () => {
  test('Should return an account on success', async () => {
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
