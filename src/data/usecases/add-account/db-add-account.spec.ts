import { DBAddAccount } from './db-add-account'

describe('DBAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypt (value: string): Promise<string> {
        return new Promise(resolve => resolve('hashed_password'))
      }
    }
    const encrypterStub = new EncrypterStub()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const sut = new DBAddAccount(encrypterStub)
    const accountData = {
      name: 'valid name',
      email: 'valid@email.com',
      password: 'V4l!dPassword'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('V4l!dPassword')
  })
})
