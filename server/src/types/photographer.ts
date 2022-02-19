import { Document } from "mongoose";
import { IBooking } from "./booking";
import { IAvailability } from "./availability";

export interface IPhotographer extends Document {
  name: string;
  availabilities: IAvailability[];
  bookings: IBooking[];
}

export interface IPhotographerBookingResponse {
  photographer: { id: string; name: string };
  timeSlot: { starts: string; ends: string };
}
