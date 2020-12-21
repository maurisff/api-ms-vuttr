import bcrypt from 'bcryptjs'
import UserRepository from '@repositories/UserRepository'
import Logger from '@utils/Logger'

export default class InitializeDatabase {
  private readonly userRepository: UserRepository;

  constructor () {
    this.userRepository = new UserRepository()
  }

  async createDefaultUser (): Promise<void> {
    try {
      const login = 'admin'
      const password = '123456'
      const name = 'Administrator'
      const defaultUser = await this.userRepository.findByLogin(login)
      if (!defaultUser) {
        await this.userRepository.create({ login, password: bcrypt.hashSync(password, 8), name })
        console.log(`Created default User (${name}) with login (${login}) and password (${password})`)
      }
    } catch (error) {
      Logger.error('createDefaultUser - Error: ', error)
    }
  }
}
