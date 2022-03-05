import Photographer from "../../models/photographer";
import {
  IPhotographer,
  IPhotographerBookingResponse,
  IPhotographerService,
} from "../../types/photographer";
import { IAvailability } from "../../types/availability";
import { IBooking } from "../../types/booking";
import { dateDiffInMinutesBetweenTwoDate } from '../../helpers/date-differ'

const photographerService: IPhotographerService = {
  get: async (): Promise<IPhotographer[]> => {
    const photographers: IPhotographer[] = await Photographer.find();
    return photographers;
  },

  getAvailablesByDuration: async (
    durationInMinutes: number
  ): Promise<IPhotographerBookingResponse[]> => {
    const reservedPhotographersWithTimeSlot: IPhotographerBookingResponse[] =
      [];

    const availablePhotographers = await Photographer.find({
      availabilities: {
        $exists: true,
        $type: "array",
        $ne: [],
      },
    });

    // pushing earliest acceptable availabilities to the response
    availablePhotographers.map((availablePhotographer) => {
      const acceptableAvailabilities: IAvailability[] = [];

      availablePhotographer.availabilities.map((availability) => {
        const dateDiffForAvailability = dateDiffInMinutesBetweenTwoDate(
          availability.starts,
          availability.ends,
        )
        // if there is any time period >= than duration
        // push it to the acceptableAvailabilities
        if (dateDiffForAvailability >= durationInMinutes) {
          acceptableAvailabilities.push({
            starts: availability.starts,
            ends: availability.ends,
          });
        }
      });

      // We can not start reducing with empty array
      if (acceptableAvailabilities.length) {
        reservedPhotographersWithTimeSlot.push({
          photographer: {
            id: availablePhotographer._id,
            name: availablePhotographer.name,
          },
        });

        // shaving acceptableAvailabilities with bookings
        if (availablePhotographer.bookings.length) {
          availablePhotographer.bookings.map((booking) => {
            const startsOfBooking = new Date(booking.starts).getTime()
            const endsOfBooking = new Date(booking.ends).getTime()

            acceptableAvailabilities.map((acceptableAvailability, acceptableAvailabilityIndex) => {
              const startsOfAcceptableAvailability = new Date(acceptableAvailability.starts).getTime()
              const endsOfAcceptableAvailability = new Date(acceptableAvailability.ends).getTime()

              // if booking covers all the availability, remove the availability from acceptableAvailabilities.
              if (startsOfBooking === startsOfAcceptableAvailability && endsOfBooking === endsOfAcceptableAvailability) {
                acceptableAvailabilities.splice(acceptableAvailabilityIndex, 1)
              }

              // if booking starts at the beginning of the availability
              if (startsOfBooking === startsOfAcceptableAvailability && endsOfBooking !== endsOfAcceptableAvailability) {
                acceptableAvailability.starts = booking.ends

                // if rest of availability < than duration, just remove it.
                const dateDiff = dateDiffInMinutesBetweenTwoDate(
                  acceptableAvailability.starts,
                  acceptableAvailability.ends
                )
                if (dateDiff < durationInMinutes) {
                  acceptableAvailabilities.splice(acceptableAvailabilityIndex, 1)
                }
              }

              // if booking ends at the ending of the availability
              if (startsOfBooking === startsOfAcceptableAvailability && endsOfBooking !== endsOfAcceptableAvailability) {
                acceptableAvailability.ends = booking.starts

                // if rest of availability < than duration, just remove it.
                const dateDiff = dateDiffInMinutesBetweenTwoDate(
                  acceptableAvailability.starts,
                  acceptableAvailability.ends
                )
                if (dateDiff < durationInMinutes) {
                  acceptableAvailabilities.splice(acceptableAvailabilityIndex, 1)
                }
              }

              // if booking is at the somewhere in the availability, split the availability
              if (startsOfBooking > startsOfAcceptableAvailability && endsOfBooking < endsOfAcceptableAvailability) {
                const newAcceptableAvailability = { starts: acceptableAvailability.starts, ends: acceptableAvailability.ends }
                acceptableAvailability.ends = booking.starts
                newAcceptableAvailability.starts = booking.ends

                // if first availability < than duration, just remove it.
                const dateDiffForFirst = dateDiffInMinutesBetweenTwoDate(
                  acceptableAvailability.starts,
                  acceptableAvailability.ends
                )
                if (dateDiffForFirst < durationInMinutes) {
                  acceptableAvailabilities.splice(acceptableAvailabilityIndex, 1)
                }

                // if second availability < than duration, just remove it.
                const dateDiffForSecond = dateDiffInMinutesBetweenTwoDate(
                  newAcceptableAvailability.starts,
                  newAcceptableAvailability.ends
                )
                if (dateDiffForSecond < durationInMinutes) {
                  acceptableAvailabilities.splice(acceptableAvailabilityIndex, 1)
                } else {
                  acceptableAvailabilities.push({
                    starts: newAcceptableAvailability.starts,
                    ends: newAcceptableAvailability.ends,
                  })
                }
              }
            })
          })
        }

        // find earliest time period inside the acceptableAvailabilities
        const earlierAcceptableAvailability = acceptableAvailabilities.reduce((earlierAcceptableAvailability, item) =>
          item.starts < earlierAcceptableAvailability.starts ? item : earlierAcceptableAvailability
        );

        // find photographer index inside the reservedPhotographersWithTimeSlot
        const reservedPhotographerIndex =
        reservedPhotographersWithTimeSlot.findIndex(
          ({ photographer }) =>
            photographer.name === availablePhotographer.name
        );

        // add acceptableAvailability to the reserved photographer
        Object.assign(
          reservedPhotographersWithTimeSlot[reservedPhotographerIndex],
          {
            timeSlot: {
              starts: earlierAcceptableAvailability.starts,
              ends: new Date(
                new Date(earlierAcceptableAvailability.starts).getTime() +
                  durationInMinutes * 60000
              ),
            },
          }
        );
      }
    });

    return reservedPhotographersWithTimeSlot;
  },

  create: async (
    name: string,
    availabilities: IAvailability[],
    bookings: IBooking[]
  ): Promise<IPhotographer> => {
    const photographer: IPhotographer = new Photographer({
      name,
      availabilities,
      bookings,
    });
    await photographer.save();

    return photographer;
  },

  patch: async (
    id: string,
    body: Pick<IPhotographer, "name" | "availabilities" | "bookings">
  ): Promise<IPhotographer | null> => {
    const photographer: IPhotographer | null =
      await Photographer.findByIdAndUpdate({ _id: id }, body, { new: true });

    return photographer;
  },

  delete: async (id: string): Promise<IPhotographer | null> => {
    const deletedPhotographer: IPhotographer | null =
      await Photographer.findByIdAndDelete(id);

    return deletedPhotographer;
  },
};

export default photographerService;
