import mongoose, { Schema, Document } from 'mongoose'

export interface ITool extends Document {
  title: string,
  link: string,
  description: string,
  tags: string[]
}

const ColletionSchema: Schema = new Schema({
  title: {
    type: String,
    required: 'title is required'
  },
  link: {
    type: String,
    required: 'link is required'
  },
  description: {
    type: String,
    required: 'description is required'
  },
  tags: {
    type: [String]
  }
})
ColletionSchema.index({ title: 'text', link: 'text', description: 'text', tags: 'text' })
ColletionSchema.index({ tags: 1 })
export default mongoose.model <ITool>('Tool', ColletionSchema)
