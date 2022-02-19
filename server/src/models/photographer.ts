import { IPhotographer } from "../types/photographer";
import { model, Schema } from "mongoose";

const Photographer: Schema = new Schema({
  name: String,
  availabilities: [
    {
      starts: Date,
      ends: Date,
      _id: false,
    },
  ],
  bookings: [
    {
      starts: Date,
      ends: Date,
    },
  ],
});

export default model<IPhotographer>("photographers", Photographer);
