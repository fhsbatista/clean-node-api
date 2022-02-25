import { AccountModel, AddAccountModel, AddAccountRepository, LoadAccountByEmailRepository, Hasher } from './db-add-account-protocols'
import { DBAddAccount } from './db-add-account'

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_password'))
    }
  }
  return new HasherStub()
}

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakePersistedAccount()))
    }
  }
  return new AddAccountRepositoryStub()
}

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(makeFakePersistedAccount()))
    }
  }
  return new LoadAccountByEmailRepositoryStub()
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
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher()
  const addAccountRepositoryStub = makeAddAccountRepository()
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository()
  const sut = new DBAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)
  return {
    sut,
    hasherStub,
    addAccountRepositoryStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DBAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.add(makeFakeAccountToPersist())
    expect(hashSpy).toHaveBeenCalledWith('V4l!dPassword')
  })

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'hash').mockImplementationOnce(() => { throw new Error() })
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

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await sut.add(makeFakeAccountToPersist())
    expect(loadAccountSpy).toHaveBeenCalledWith('valid@email.com')
  })
})
