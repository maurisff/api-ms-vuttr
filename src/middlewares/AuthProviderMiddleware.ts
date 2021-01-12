import AppError from '@utils/AppError'
import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers'
import IPayloadSecurity from '@interfaces/IPayloadSecurity'

@Middleware({ type: 'before' })
export default class AuthProviderMiddleware implements ExpressMiddlewareInterface {
  private noAuthPaths: string[] = ['session/authentication']
  use (request: Request, response: Response, next: NextFunction) {
    if (request.method === 'OPTIONS') {
      return response.sendStatus(204)
    }

    if (this.noAuthPaths.findIndex((f) => request.path.match(f)) > -1) {
      return next()
    }

    const { authorization } = request.headers

    if (!authorization || authorization.indexOf('Bearer ') === -1) {
      throw new AppError('Missing Authorization Header', 401)
    }

    const tokenJWT = authorization.replace('Bearer ', '')

    if (!tokenJWT) {
      throw new AppError('JWT token is missing', 401)
    }

    try {
      const payload: IPayloadSecurity = <IPayloadSecurity> verify(tokenJWT, process.env.JWT_SECRET)

      const { user } = payload
      if (user) {
        const { id } = user
        request.userId = id
      }
      return next()
    } catch (error) {
      throw new AppError('Unauthorized', 401)
    }
  }
}
