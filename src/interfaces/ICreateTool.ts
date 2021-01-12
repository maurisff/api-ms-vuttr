import { ITool } from '@models/tool.model'

export default interface ICreateTool {
  title: ITool['title'],
  link: ITool['link'],
  description: ITool['description'],
  tags: ITool['tags']
}
