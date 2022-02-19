import Photographer from "../../models/photographer";
import { IPhotographer } from "../../types/photographer";
import { IAvailability } from "../../types/availability";
import { IBooking } from "../../types/booking";

const photographerService = {
  get: async (): Promise<IPhotographer[]> => {
    try {
      const photographers: IPhotographer[] = await Photographer.find()
      return photographers
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
        await Photographer.findByIdAndDelete(id)

      return deletedPhotographer
    } catch (error) {
      throw error
    }
  }
};

export { photographerService };
