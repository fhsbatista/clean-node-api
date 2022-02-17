import { AccountModel, AddAccountModel, AddAccountRepository, Encrypter } from './db-add-account-protocols'
import { DBAddAccount } from './db-add-account'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakePersistedAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeFakeAccountToPersist = (): AddAccountModel => ({
  name: 'valid name',
  email: 'valid@email.com',
  password: 'V4l!dPassword'
})

const makeFakePersistedAccount = (): AccountModel => ({
  id: '123',
  name: makeFakeAccountToPersist().name,
  email: makeFakeAccountToPersist().email,
  password: 'hashed_password'
})

interface SutTypes {
  sut: DBAddAccount
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const sut = new DBAddAccount(encrypterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterStub,
    addAccountRepositoryStub
  }
}

describe('DBAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.add(makeFakeAccountToPersist())
    expect(encryptSpy).toHaveBeenCalledWith('V4l!dPassword')
  })

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeFakeAccountToPersist())
    await expect(promise).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await sut.add(makeFakeAccountToPersist())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid name',
      email: 'valid@email.com',
      password: 'hashed_password'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest.spyOn(addAccountRepositoryStub, 'add').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.add(makeFakeAccountToPersist())
    await expect(promise).rejects.toThrow()
  })

  test('Should return correct account on success', async () => {
    const sut = makeSut().sut
    const account = await sut.add(makeFakeAccountToPersist())
    expect(account).toEqual(makeFakePersistedAccount())
  })
})
