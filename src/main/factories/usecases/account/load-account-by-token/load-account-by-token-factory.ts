import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { LoadAccountByToken } from '../../../../../domain/usecases/load-account-by-token'
import { DBLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'

export const makeDBLoadAccountByToken = (): LoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const loadAccountByTokenRepository = new AccountMongoRepository()
  return new DBLoadAccountByToken(jwtAdapter, loadAccountByTokenRepository)
}
