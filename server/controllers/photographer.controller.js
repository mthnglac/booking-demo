const Photographer = require('../models/photographer')

const getPhotographers = async (req, res) => {
  const photographers = await Photographer.find()
  res.send(photographers)
}

const createPhotographer = async (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).send({
      error: 'You must provide a photographer',
    })
  }

  const photographer = new Photographer(body)
  await photographer.save()
  res.send(photographer)
}

const patchPhotographer = async (req, res) => {
  const body = req.body

  if (!body) {
    return res.status(400).send({ error: 'You must provide a body to update' })
  }


  try {
    const photographer = await Photographer.findOne({ _id: req.params.id })

    if (req.body.name) {
      photographer.name = req.body.name
    }

    //if (req.body.availabilities) {
      //photographer.availabilities = req.body.content
    //}

    await photographer.save()
    res.send(photographer)
  } catch {
    res.status(404).send({ error: "Photographer doesn't exist!" })
  }
}

const deletePhotographer = async (req, res) => {
  try {
    const photographer = await Photographer.findOneAndDelete({ _id: req.params.id })

    if (!photographer) {
      res.status(404).send({ error: "Photographer doesn't exist!" })
    }

    res.status(204).send()
  } catch {
    res.status(404).send({ error: "Photographer doesn't exist!" })
  }
}

module.exports = {
  getPhotographers,
  createPhotographer,
  patchPhotographer,
  deletePhotographer
}
