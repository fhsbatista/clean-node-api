import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapters'
import { adaptRoute } from '../adapters/express-route-adapters'
import { makeAddSurveyController } from '../factories/controllers/surveys/add-surveys/add-survey-controller-factory'
import { makeAuthMiddleware } from '../factories/middlewares/auth-middlware-factory'

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'))
  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()))
}
