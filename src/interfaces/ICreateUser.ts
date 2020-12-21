import { IUser } from '@models/user.model'

export default interface ICreateUser {
  login: IUser['login'],
  name: IUser['name'],
  password: IUser['password']
}
