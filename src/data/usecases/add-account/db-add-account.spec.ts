import { Encrypter } from './db-add-account-protocols'
import { DBAddAccount } from './db-add-account'

interface SutTypes {
  sut: DBAddAccount
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DBAddAccount(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('DBAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid name',
      email: 'valid@email.com',
      password: 'V4l!dPassword'
    }
    await sut.add(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('V4l!dPassword')
  })

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const accountData = {
      name: 'valid name',
      email: 'valid@email.com',
      password: 'V4l!dPassword'
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
