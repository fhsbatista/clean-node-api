import bcrypt from 'bcrypt'
import { BCryptAdapter } from './bcrypt-adapter'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return new Promise(resolve => resolve('hashed_value'))
  }
}))

describe('BCrypt Adapter', () => {
  test('Should call Bcrypt with correct value', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  test('Should return correct hash on success', async () => {
    const salt = 12
    const sut = new BCryptAdapter(salt)
    // jest.spyOn(bcrypt, 'hash').mockReturnValueOnce('hashed_value')
    const hash = await sut.encrypt('any_value')
    expect(hash).toEqual('hashed_value')
  })
})
