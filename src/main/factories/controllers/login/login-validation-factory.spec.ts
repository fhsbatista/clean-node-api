import { ValidationComposite, EmailValidation, RequiredFieldValidation } from '../../../../presentation/helpers/validators'
import { EmailValidator } from '../../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../../presentation/helpers/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: String): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('LoginValidation Factory ', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new EmailValidation(makeEmailValidator(), 'email')
    ])
  })
})
