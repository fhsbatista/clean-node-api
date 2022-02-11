import { HttpResponse, HttpRequest, Controller, EmailValidator, AddAccount } from './signup-protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers/http-helper'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator
    this.addAccount = addAccount
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingRequiredField = this.getRequiredFieldMissing(httpRequest.body)
      if (missingRequiredField) {
        return badRequest(new MissingParamError(missingRequiredField))
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (!this.arePasswordsValid(password, passwordConfirmation)) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      return ok(account)
    } catch (error) {
      return serverError(error)
    }
  }

  getRequiredFieldMissing (body: any): string {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const field of requiredFields) {
      if (!body[field]) {
        return field
      }
    }
    return null
  }

  arePasswordsValid (password: string, passwordConfirmation: string): boolean {
    return password === passwordConfirmation
  }
}
