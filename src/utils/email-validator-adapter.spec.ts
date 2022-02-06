import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidator adapter', () => {
  test('Should return false if validator returns false ', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid@email.com')
    expect(isValid).toBe(false)
  })
})
