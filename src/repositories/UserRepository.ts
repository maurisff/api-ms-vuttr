import { IUser } from '@models/user.model'
import mongoose, { FilterQuery, Model } from 'mongoose'
import ICreateUser from '@interfaces/ICreateUser'

export default class UserRepository {
  private readonly Model: Model<IUser>;

  constructor () {
    this.Model = mongoose.model('User')
  }

  async create (data: ICreateUser): Promise<IUser> {
    return await new this.Model(data).save()
  }

  async get (id: string): Promise<IUser> {
    return await this.Model.findById(id).select('login name _id')
  }

  async find (filter: FilterQuery<IUser>): Promise<IUser[]> {
    return await this.Model.find(filter).select('login name _id')
  }

  async findAll (): Promise<IUser[]> {
    return await this.find({})
  }

  async findByLogin (login: string): Promise<IUser> {
    return await this.Model.findOne({ login })
  }
}
