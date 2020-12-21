import bcrypt from 'bcryptjs'
import Repository from '@repositories/UserRepository'
import { IUser } from '@models/user.model'
import IUserSession from '@interfaces/IUserSession'
import AppError from '@utils/AppError'

export default class UserService {
  private readonly repository: Repository;

  constructor () {
    this.repository = new Repository()
  }

  /**
   * Method to validate already registered user
   * @param {string} login
   */
  public async validateUser (login: string): Promise<void> {
    const data = await this.repository.findByLogin(login.toLowerCase())
    if (data) {
      throw new AppError('login already exists')
    }
  }

  /**
   * User and password validation method
   * @param {string} login
   * @param {string} password
   * @return {Object<UserSession>} user
   */
  public async validateUserPassword (login: string, password: string): Promise<IUserSession> {
    const data: IUser = await this.repository.findByLogin(login.toLowerCase())
    if (!data || !bcrypt.compareSync(password, data.password)) {
      throw new AppError('Invalid credentials')
    }
    return {
      id: data.id,
      login: data.login,
      name: data.name
    }
  }
}
