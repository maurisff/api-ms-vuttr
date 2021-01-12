import { ITool } from '@models/tool.model'
import mongoose, { FilterQuery, Model } from 'mongoose'
import ICreateTool from '@interfaces/ICreateTool'

export default class UserRepository {
  private readonly Model: Model<ITool>;

  constructor () {
    this.Model = mongoose.model('Tool')
  }

  async create (data: ICreateTool): Promise<ITool> {
    return await new this.Model(data).save()
  }

  async get (id: string): Promise<ITool> {
    return await this.Model.findById(id).select('-__v')
  }

  async find (filter: FilterQuery<ITool>): Promise<ITool[]> {
    return await this.Model.find(filter).select('-__v')
  }

  async findAll (): Promise<ITool[]> {
    return await this.find({})
  }

  async delete (id: string): Promise<ITool[]> {
    return await this.Model.remove({ _id: id })
  }
}
