import { Response, Request } from "express";
import {
  IPhotographer,
  IPhotographerBookingResponse,
} from "../../types/photographer";
import { photographerService } from "../../services/photographer";

const getPhotographers = async (req: Request, res: Response): Promise<void> => {
  try {
    const photographers: IPhotographer[] = await photographerService.get();

    if (photographers.length) {
      res.status(200).send(photographers);
    } else {
      res.status(404).send({ message: "Couldn't find any photographer." });
    }
  } catch {
    res.status(500).send({ error: "Problem at server."})
  }
};

const getAvailablePhotographersByDuration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const durationInMinutes = req.query.duration as unknown as number;
    const availablePhotographersWithTimeSlot: IPhotographerBookingResponse[] =
      await photographerService.getAvailablesByDuration(durationInMinutes);
    res.status(200).send(availablePhotographersWithTimeSlot);
  } catch {
    res.status(500).send({ error: "Problem at server."})
  }
};

const createPhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body as Pick<
    IPhotographer,
    "name" | "availabilities" | "bookings"
  >;

  try {
    const photographer: IPhotographer = await photographerService.create(
      body.name,
      body.availabilities,
      body.bookings
    );

    res.status(201).send({ message: "Photographer added.", photographer });
  } catch {
    res.status(500).send({ error: "Problem at server."})
  }
};

const patchPhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const photographer: IPhotographer | null = await photographerService.patch(
      req.params.id,
      req.body
    );

    if (!photographer) {
      res.status(404).send({ message: "Photographer not found." });
    } else {
      res.status(200).send({ message: "Photographer updated.", photographer });
    }
  } catch {
    res.status(500).send({ error: "Problem at server."})
  }
};

const deletePhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const photographer: IPhotographer | null = await photographerService.delete(
      req.params.id
    );

    if (!photographer) {
      res.status(404).send({ message: "Photographer doesn't exist!." });
    } else {
      res.status(204).send();
    }
  } catch {
    res.status(500).send({ error: "Problem at server."})
  }
};

export {
  getPhotographers,
  getAvailablePhotographersByDuration,
  createPhotographer,
  patchPhotographer,
  deletePhotographer,
};
