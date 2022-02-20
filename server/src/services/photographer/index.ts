import Photographer from "../../models/photographer";
import {
  IPhotographer,
  IPhotographerBookingResponse,
} from "../../types/photographer";
import { IAvailability } from "../../types/availability";
import { IBooking } from "../../types/booking";
import { ITimeSlot } from "../../types/timeslot";
import { dateDiffInMinutesBetweenTwoDate } from '../../helpers/date-differ'

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
          const dateDiffForAvailability = dateDiffInMinutesBetweenTwoDate(
            availability.starts,
            availability.ends,
          )
          // if there is any time period bigger than duration
          // push it to the timeSlots
          if (dateDiffForAvailability >= durationInMinutes) {
            timeSlots.push({
              starts: availability.starts,
              ends: availability.ends,
            });
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

          // shaving timeSlots with bookings
          if (availablePhotographer.bookings.length) {
            availablePhotographer.bookings.map((booking) => {
              const startsOfBooking = new Date(booking.starts).getTime()
              const endsOfBooking = new Date(booking.ends).getTime()

              timeSlots.map((timeSlot, timeSlotIndex) => {
                const startsOfTimeSlot = new Date(timeSlot.starts).getTime()
                const endsOfTimeSlot = new Date(timeSlot.ends).getTime()

                //const dateDiff = Math.abs(
                  //new Date(timeSlot.starts).valueOf() - new Date(booking.starts).valueOf()
                //);
                //const dateDiffInMinutes = Math.floor(dateDiff / 1000 / 60);

                //// if booking starts after the time slot but more time elapsed than duration
                //// availability should end at start of existing booking
                //if (startsOfBooking >= startsOfTimeSlot && dateDiffInMinutes >= durationInMinutes) {
                  //timeSlot.ends = startsOfBooking.toString()
                //} else {
                  //// if booking starts after the time slot but more time has not elapsed than duration
                  //// availability should start at end of existing booking
                  //timeSlot.starts = endsOfBooking.toString()
                //}



                // if booking covers all the availability, remove the availability from timeSlots.
                if (startsOfBooking === startsOfTimeSlot && endsOfBooking === endsOfTimeSlot) {
                  timeSlots.splice(timeSlotIndex, 1)
                }

                // if booking starts at the beginning of the availability
                if (startsOfBooking === startsOfTimeSlot && endsOfBooking !== endsOfTimeSlot) {
                  timeSlot.starts = booking.ends

                  // if rest of availability < than duration, just remove it.
                  const dateDiff = dateDiffInMinutesBetweenTwoDate(
                    timeSlot.starts,
                    timeSlot.ends
                  )
                  if (dateDiff < durationInMinutes) {
                    timeSlots.splice(timeSlotIndex, 1)
                  }
                }

                // if booking ends at the ending of the availability
                if (startsOfBooking === startsOfTimeSlot && endsOfBooking !== endsOfTimeSlot) {
                  timeSlot.ends = booking.starts

                  // if rest of availability < than duration, just remove it.
                  const dateDiff = dateDiffInMinutesBetweenTwoDate(
                    timeSlot.starts,
                    timeSlot.ends
                  )
                  if (dateDiff < durationInMinutes) {
                    timeSlots.splice(timeSlotIndex, 1)
                  }
                }

                // if booking is at the somewhere in the availability, split the availability
                if (startsOfBooking > startsOfTimeSlot && endsOfBooking < endsOfTimeSlot) {
                  const newTimeSlot = { starts: timeSlot.starts, ends: timeSlot.ends }
                  timeSlot.ends = booking.starts
                  newTimeSlot.starts = booking.ends

                  // if first availability < than duration, just remove it.
                  const dateDiffForFirst = dateDiffInMinutesBetweenTwoDate(
                    timeSlot.starts,
                    timeSlot.ends
                  )
                  if (dateDiffForFirst < durationInMinutes) {
                    timeSlots.splice(timeSlotIndex, 1)
                  }

                  // if second availability < than duration, just remove it.
                  const dateDiffForSecond = dateDiffInMinutesBetweenTwoDate(
                    newTimeSlot.starts,
                    newTimeSlot.ends
                  )
                  if (dateDiffForSecond < durationInMinutes) {
                    timeSlots.splice(timeSlotIndex, 1)
                  } else {
                    timeSlots.push({
                      starts: newTimeSlot.starts,
                      ends: newTimeSlot.ends,
                    })
                  }
                }
              })
            })
          }

          // find earliest time slot inside the timeSlots
          const earlierTimeSlot = timeSlots.reduce((earlierTimeSlot, item) =>
            item.starts < earlierTimeSlot.starts ? item : earlierTimeSlot
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
