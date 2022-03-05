import { Document } from "mongoose";
import { IBooking } from "./booking";
import { IAvailability } from "./availability";
import { Response, Request, Express, Router } from "express";

export interface IPhotographer extends Document {
  name: string;
  availabilities: IAvailability[];
  bookings: IBooking[];
}

export interface IPhotographerBookingResponse {
  photographer: { id: string; name: string };
  timeSlot?: IAvailability;
}

export interface IPhotographerService {
  get: () => Promise<IPhotographer[]>;
  getAvailablesByDuration: (
    durationInMinutes: number
  ) => Promise<IPhotographerBookingResponse[]>;
  create: (
    name: string,
    availabilities: IAvailability[],
    bookings: IBooking[]
  ) => Promise<IPhotographer>;
  patch: (
    id: string,
    body: Pick<IPhotographer, "name" | "availabilities" | "bookings">
  ) => Promise<IPhotographer | null>;
  delete: (id: string) => Promise<IPhotographer | null>;
}

export interface IPhotographerController {
  (photographerService: IPhotographerService): {
    getAll: (req: Request, res: Response) => Promise<void>;
    getAvailablesByDuration: (req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    patchById: (req: Request, res: Response) => Promise<void>;
    deleteById: (req: Request, res: Response) => Promise<void>;
  };
}
