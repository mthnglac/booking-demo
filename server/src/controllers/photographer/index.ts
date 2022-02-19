import { Response, Request } from "express";
import { IPhotographer } from "../../types/photographer";
import { photographerService } from "../../services/photographer";

const getPhotographers = async (req: Request, res: Response): Promise<void> => {
  const photographers: IPhotographer[]  = await photographerService.get();
  res.status(200).send(photographers);
};

const createPhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const body = req.body as Pick<
    IPhotographer,
    "name" | "availabilities" | "bookings"
  >;

  const photographer: IPhotographer = await photographerService.create(
    body.name,
    body.availabilities,
    body.bookings
  );

  res.status(201).send({ message: "Photographer added.", photographer });
};

const patchPhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const photographer: IPhotographer | null = await photographerService.patch(
    req.params.id,
    req.body
  );

  res.status(200).send({ message: "Photographer updated.", photographer });
};

const deletePhotographer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const photographer: IPhotographer | null = await photographerService.delete(
    req.params.id
  );

  if (!photographer) {
    res.status(404).send({ message: "Photographer doesn't exist!." });
  } else {
    res.status(204).send();
  }
};

export {
  getPhotographers,
  createPhotographer,
  patchPhotographer,
  deletePhotographer,
};
