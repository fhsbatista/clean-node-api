import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DBAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'

export const makeSignUpController = (): SignUpController => {
  const addAccountRepository = new AccountMongoRepository()
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const dbAddAccount = new DBAddAccount(bcryptAdapter, addAccountRepository)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  return new SignUpController(emailValidatorAdapter, dbAddAccount)
}
