import { CompareFieldsValidation, EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../../validation/validators'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'
import { makeSignUpValidation } from './signup-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: String): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpValidation Factory ', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('name'),
      new RequiredFieldValidation('email'),
      new RequiredFieldValidation('password'),
      new RequiredFieldValidation('passwordConfirmation'),
      new CompareFieldsValidation('password', 'passwordConfirmation'),
      new EmailValidation(makeEmailValidator(), 'email')
    ])
  })
})
