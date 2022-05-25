import { ValidationComposite, RequiredFieldValidation } from '../../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

jest.mock('../../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory ', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('question'),
      new RequiredFieldValidation('answers')
    ])
  })
})
