import { Response, Request } from 'express'
import { IPhotographer } from '../../types/photographer'
import Photographer from '../../models/photographer'

const getPhotographers = async (req: Request, res: Response): Promise<void> => {
  try {
    const photographers: IPhotographer[] = await Photographer.find()
    res.status(200).send(photographers)
  } catch (error) {
    throw error
  }
}

const createPhotographer = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<IPhotographer, "name" | "activities" | "bookings">

    const photographer: IPhotographer = new Photographer({
      name: body.name,
      activities: body.activities,
      bookings: body.bookings,
    })

    const newPhotographer = await photographer.save()

    res.status(201).send({ message: "Photographer added.", photographer: newPhotographer })
  } catch (error) {
    throw error
  }
}

const patchPhotographer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { params: { id }, body } = req
    const updatedPhotographer: IPhotographer | null = await Photographer.findByIdAndUpdate({ _id: id }, body)

    res.status(200).send({ message: "Photographer updated.", photographer: updatedPhotographer })
  } catch (error) {
    throw error
  }
}

const deletePhotographer = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedPhotographer: IPhotographer | null = await Photographer.findByIdAndDelete(req.params.id)

    res.status(204).send({ message: "Photographer deleted.", photographer: deletedPhotographer })
  } catch (error) {
    throw error
  }
}

export {
  getPhotographers,
  createPhotographer,
  patchPhotographer,
  deletePhotographer
}
