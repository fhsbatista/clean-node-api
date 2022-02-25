import { DBAuthentication } from '../../../../data/usecases/authentication/db-authentication'
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BCryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { Authentication } from '../../../../domain/usecases/authentication'
import env from '../../../config/env'

export const makeDBAuthentication = (): Authentication => {
  const salt = 12
  const bcryptAdapter = new BCryptAdapter(salt)
  const jwtAdapter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DBAuthentication(accountMongoRepository, bcryptAdapter, jwtAdapter, accountMongoRepository)
}
