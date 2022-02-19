import { InvalidParamError, MissingParamError } from '../../errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const missingRequiredField = this.getRequiredFieldMissing(httpRequest.body)
      if (missingRequiredField) {
        return badRequest(new MissingParamError(missingRequiredField))
      }
      const { email, password } = httpRequest.body
      const isEmailValid = this.emailValidator.isValid(email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken: accessToken })
    } catch (error) {
      return serverError(error)
    }
  }

  getRequiredFieldMissing (body: any): string {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!body[field]) {
        return field
      }
    }
    return null
  }
}
