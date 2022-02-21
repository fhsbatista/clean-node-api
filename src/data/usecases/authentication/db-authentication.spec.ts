import { AccountModel } from '../../../domain/models/account'
import { LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { DBAuthentication } from './db-authentication'

describe('DBAuthentication Usecase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any@email.com',
          password: 'hash'
        }
        return new Promise(resolve => resolve(account))
      }
    }
    const loadAccountByEmailRepository = new LoadAccountByEmailRepositoryStub()
    const sut = new DBAuthentication(loadAccountByEmailRepository)
    const loadAccountSpy = jest.spyOn(loadAccountByEmailRepository, 'load')
    await sut.auth({
      email: 'any@email.com',
      password: 'any_passoword'
    })
    expect(loadAccountSpy).toHaveBeenCalledWith('any@email.com')
  })
})
