import Repository from '@repositories/ToolRepository'
import { ITool } from '@models/tool.model'
import { Body, Delete, Get, HttpCode, JsonController, OnUndefined, Param, Post, QueryParam } from 'routing-controllers'
import ICreateTool from '@interfaces/ICreateTool'
import AppError from '@utils/AppError'

@JsonController('/tools')
export default class ToolControllers {
  private readonly repository: Repository = new Repository();

  @HttpCode(201)
  @Post()
  public async create (@Body() tool: ICreateTool): Promise<ITool> {
    try {
      const { title, link, description, tags } = tool
      const data: ITool = await this.repository.create({ title, link, description, tags })
      return await this.repository.get(data.id)
    } catch (error) {
      throw new AppError(error.message)
    }
  }

  @Delete('/:id')
  @OnUndefined(204)
  public async delete (@Param('id') id: string): Promise<void> {
    try {
      await this.repository.delete(id)
    } catch (error) {
      throw new AppError(error.message)
    }
  }

  @Get()
  public async find (@QueryParam('q') q: string, @QueryParam('tag') tag: string): Promise<ITool[]> {
    try {
      let data: ITool[] = []
      if (q) {
        data = await this.repository.find({ $text: { $search: q } })
      } else if (tag) {
        data = await this.repository.find({ tags: { $all: [tag] } })
      } else {
        data = await this.repository.findAll()
      }
      return data
    } catch (error) {
      throw new AppError(error.message)
    }
  }
}
