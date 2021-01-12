import bcrypt from 'bcryptjs'
import Repository from '@repositories/UserRepository'
import Service from '@services/UserService'
import { IUser } from '@models/user.model'
import { Body, Controller, Get, HttpCode, Post, QueryParam } from 'routing-controllers'
import ICreateUser from '@interfaces/ICreateUser'
import AppError from '@utils/AppError'

@Controller('/user')
export default class UserController {
  private readonly service: Service = new Service();
  private readonly repository: Repository = new Repository();

  @HttpCode(201)
  @Post()
  public async create (@Body() user: ICreateUser): Promise<IUser> {
    try {
      await this.service.validateUser(user.login)
      const data: IUser = await this.repository.create({ login: user.login.toLowerCase(), password: bcrypt.hashSync(user.password, 8), name: user.name })
      return await this.repository.get(data.id)
    } catch (error) {
      throw new AppError(error.message)
    }
  }

  @Get()
  public async find (@QueryParam('q') q: string): Promise<IUser[]> {
    try {
      let data: IUser[] = []
      if (q) {
        data = await this.repository.find({ $text: { $search: q } })
      } else {
        data = await this.repository.findAll()
      }
      return data
    } catch (error) {
      throw new AppError(error.message)
      // return response.status(400).json({ error: error.message })
    }
  }
}
