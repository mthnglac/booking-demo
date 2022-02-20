import Photographer from "../../models/photographer";
import {
  IPhotographer,
  IPhotographerBookingResponse,
} from "../../types/photographer";
import { IAvailability } from "../../types/availability";
import { IBooking } from "../../types/booking";
import { ITimeSlot } from "../../types/timeslot";

const photographerService = {
  get: async (): Promise<IPhotographer[]> => {
    try {
      const photographers: IPhotographer[] = await Photographer.find();
      return photographers;
    } catch (error) {
      throw error;
    }
  },

  getAvailablesByDuration: async (
    durationInMinutes: number
  ): Promise<IPhotographerBookingResponse[]> => {
    const reservedPhotographersWithTimeSlot: IPhotographerBookingResponse[] =
      [];

    try {
      const availablePhotographers = await Photographer.find({
        availabilities: {
          $exists: true,
          $type: "array",
          $ne: [],
        },
      });

      // pushing earliest timeslots to the booking response
      availablePhotographers.map((availablePhotographer) => {
        const timeSlots: ITimeSlot[] = [];

        availablePhotographer.availabilities.map((availability) => {
          // calculate time period of availability in minutes
          const { starts, ends } = availability;
          const dateDiff = Math.abs(
            new Date(starts).valueOf() - new Date(ends).valueOf()
          );
          const dateDiffInMinutes = Math.floor(dateDiff / 1000 / 60);

          // if there is any time period bigger than duration
          // push it to the timeSlots
          if (dateDiffInMinutes >= durationInMinutes) {
            timeSlots.push(availability);
          }
        });

        // We can not start reducing with empty array
        if (timeSlots.length) {
          reservedPhotographersWithTimeSlot.push({
            photographer: {
              id: availablePhotographer._id,
              name: availablePhotographer.name,
            },
          });

          // find earliest time slot inside the timeSlots
          const earlierTimeSlot = timeSlots.reduce((earlierTimeSlot, item) =>
            item.starts > earlierTimeSlot.starts ? item : earlierTimeSlot
          );

          // find photographer index inside the reservedPhotographersWithTimeSlot
          const reservedPhotographerIndex =
            reservedPhotographersWithTimeSlot.findIndex(
              ({ photographer }) =>
                photographer.name === availablePhotographer.name
            );

          // add timeSlot to the reserved photographer
          Object.assign(
            reservedPhotographersWithTimeSlot[reservedPhotographerIndex],
            {
              timeSlot: {
                starts: earlierTimeSlot.starts,
                ends: new Date(
                  new Date(earlierTimeSlot.starts).getTime() +
                    durationInMinutes * 60000
                ),
              },
            }
          );
        }
      });

      return reservedPhotographersWithTimeSlot;
    } catch (error) {
      throw error;
    }
  },

  create: async (
    name: string,
    availabilities: IAvailability[],
    bookings: IBooking[]
  ): Promise<IPhotographer> => {
    try {
      const photographer: IPhotographer = new Photographer({
        name,
        availabilities,
        bookings,
      });
      await photographer.save();

      return photographer;
    } catch (error) {
      throw error;
    }
  },

  patch: async (
    id: string,
    body: Pick<IPhotographer, "name" | "availabilities" | "bookings">
  ): Promise<IPhotographer | null> => {
    try {
      const photographer: IPhotographer | null =
        await Photographer.findByIdAndUpdate({ _id: id }, body, { new: true });

      return photographer;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id: string): Promise<IPhotographer | null> => {
    try {
      const deletedPhotographer: IPhotographer | null =
        await Photographer.findByIdAndDelete(id);

      return deletedPhotographer;
    } catch (error) {
      throw error;
    }
  },
};

export { photographerService };
