import IUserSession from './IUserSession'

export default interface IPayloadSecurity {
  user: IUserSession,
  createdAt: Date
}
