import { Response } from 'express'
import IUserSession from '@interfaces/IUserSession'

import Base64 from '@utils/Base64'

import { sign } from 'jsonwebtoken'
import { IUser } from '@models/user.model'
import IPayloadSecurity from '@interfaces/IPayloadSecurity'
import UserService from '@services/UserService'
import { Controller, HeaderParam, Post, Res } from 'routing-controllers'
import AppError from '@utils/AppError'

@Controller('/session')
export default class SessionController {
  private service: UserService = new UserService();

  private createSecurity (user: IUser | IUserSession): string {
    try {
      const { id, login, name } = user
      const payload: IPayloadSecurity = {
        user: {
          id,
          login,
          name
        },
        createdAt: new Date()
      }
      return sign(payload, process.env.JWT_SECRET)
    } catch (error) {
      throw new AppError('Error created token Security.')
    }
  }

  @Post('/authentication')
  public async authentication (@HeaderParam('authorization') authorization: string, @Res() response: Response): Promise<IUserSession> {
    try {
      if (!authorization || authorization.indexOf('Basic ') === -1) {
        throw new AppError('Missing Authorization Header', 401)
      }

      const credentials: string = authorization.replace('Basic ', '')
      const [login, password] = Base64.decode(credentials).split(':')
      const user: IUserSession = await this.service.validateUserPassword(login, password)

      const token: string = this.createSecurity(user)

      response.header('authorization', token)
      return { ...user, token }
    } catch (error) {
      throw new AppError(error.message, 401)
    }
  }
}
