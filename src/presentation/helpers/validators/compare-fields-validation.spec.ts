import { InvalidParamError } from '../../errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}

describe('CompareFieldsValidation ', () => {
  test('Should return a InvalidParamError if fields do not match', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'value',
      fieldToCompare: 'other_value'
    })
    expect(error).toEqual(new InvalidParamError('fieldToCompare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      field: 'value',
      fieldToCompare: 'value'
    })
    expect(error).toBeFalsy()
  })
})
