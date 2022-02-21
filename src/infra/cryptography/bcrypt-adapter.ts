import { Encrypter } from '../../data/protocols/cryptography/encrypter'
import bcrypt from 'bcrypt'

export class BCryptAdapter implements Encrypter {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async encrypt (value: string): Promise<string> {
    const hash = bcrypt.hash(value, this.salt)
    return hash
  }
}
