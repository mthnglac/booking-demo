import { Document } from 'mongoose'
import { IBooking } from './booking'
import { IActivity } from './activity'

export interface IPhotographer extends Document {
  name: string
  activities: IActivity[]
  bookings: IBooking[]
}
