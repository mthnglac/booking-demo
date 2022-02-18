const express = require('express')
const Photographer = require('./models/Photographer')
const router = express.Router()


router.get('/photographers', async (req, res) => {
  const photographers = await Photographer.find()
  res.send(photographers)
})

router.get('/photographers/:id', async (req, res) => {
  try {
    const photographer = await Photographer.findOne({ _id: req.params.id })
    res.send(photographer)
  } catch {
    res.status(404)
    res.send({ error: "Photographer doesn't exist!" })
  }
})

router.post('/photographers', async (req, res) => {
  const photographer = new Photographer({
    name: req.body.name,
    availabilities: req.body.availabilities,
    bookings: req.body.bookings,
  })
  await photographer.save()
  res.send(photographer)
})

//router.patch('/posts/:id', async (req, res) => {
  //console.log('selam')
  //try {
    //const post = await Post.findOne({ _id: req.params.id })

    //if (req.body.title) {
      //post.title = req.body.title
    //}

    //if (req.body.content) {
      //post.content = req.body.content
    //}

    //await post.save()
    //res.send(post)
  //} catch {
    //res.status(404)
    //res.send({ error: "Post doesn't exist!" })
  //}
//})

//router.delete('/posts/:id', async (req, res) => {
  //try {
    //const post = await Post.deleteOne({ _id: req.params.id })
    //res.status(204).send()
  //} catch {
    //res.status(404)
    //res.send({ error: "Post doesn't exist!" })
  //}
//})

module.exports = router
