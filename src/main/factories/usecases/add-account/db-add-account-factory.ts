import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BCryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { AddAccount } from '../../../../domain/usecases/add-account'
import { DBAddAccount } from '../../../../data/usecases/add-account/db-add-account'

export const makeDBAddAccount = (): AddAccount => {
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  return new DBAddAccount(bcryptAdapter, addAccountRepository, addAccountRepository)
}
