import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DBAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BCryptAdapter } from '../../infra/cryptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { Controller } from '../../presentation/protocols'
import { LogControllerDecorator } from '../decorators/log'

export const makeSignUpController = (): Controller => {
  const addAccountRepository = new AccountMongoRepository()
  const logMongoRepository = new LogMongoRepository()
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const dbAddAccount = new DBAddAccount(bcryptAdapter, addAccountRepository)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount, null)
  return new LogControllerDecorator(signUpController, logMongoRepository)
}
