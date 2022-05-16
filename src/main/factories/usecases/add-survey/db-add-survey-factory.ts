import { SurveysMongoRepository } from '../../../../infra/db/mongodb/surveys/surveys-mongo-repository'
import { DBAddSurvey } from '../../../../data/usecases/add-survey/db-add-survey'

export const makeDBAddSurvey = (): DBAddSurvey => {
  const addSurveyRepository = new SurveysMongoRepository()
  return new DBAddSurvey(addSurveyRepository)
}
