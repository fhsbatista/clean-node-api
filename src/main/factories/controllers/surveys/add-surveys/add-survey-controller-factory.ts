import { AddSurveyController } from '../../../../../presentation/controllers/surveys/add-survey/add-survey-controller'
import { Controller } from '../../../../../presentation/protocols'
import { makeLogControllerDecorator } from '../../../decorators/log-controller-decorator-factory'
import { makeDBAddSurvey } from '../../../usecases/surveys/add-survey/db-add-survey-factory'
import { makeAddSurveyValidation } from './add-survey-validation-factory'

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(makeAddSurveyValidation(), makeDBAddSurvey())
  return makeLogControllerDecorator(controller)
}
