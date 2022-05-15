import { SignUpController } from '../../../../presentation/controllers/login/signup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDBAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeDBAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(makeDBAddAccount(), makeSignUpValidation(), makeDBAuthentication())
  return makeLogControllerDecorator(controller)
}
