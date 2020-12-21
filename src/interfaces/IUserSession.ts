import { IUser } from '@models/user.model'

export default interface IUserSession {
  id: IUser['id'],
  login: IUser['login'],
  name: IUser['name'],
  token?: string
}
