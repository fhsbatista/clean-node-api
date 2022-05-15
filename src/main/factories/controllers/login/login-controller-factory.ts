import { Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controllers/login/login/login-controller'
import { makeLoginValidation } from './login-validation-factory'
import { makeDBAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeDBAuthentication(), makeLoginValidation())
  return makeLogControllerDecorator(controller)
}
