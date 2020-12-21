import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  login: string,
  password: string,
  name: string
}

const ColletionSchema: Schema = new Schema({
  login: { type: String, required: 'login is required' },
  password: { type: String, required: 'password is required' },
  name: { type: String, required: 'name is required' }
})
ColletionSchema.index({ login: 'text', name: 'text' })
ColletionSchema.index({ login: 1 }, { unique: true })
export default mongoose.model<IUser>('User', ColletionSchema)
