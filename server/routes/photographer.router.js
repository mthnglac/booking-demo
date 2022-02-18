const express = require('express')

const PhotographerCtrl = require('../controllers/photographer.controller')

const router = express.Router()

router.get('/photographers', PhotographerCtrl.getPhotographers)
router.post('/photographers', PhotographerCtrl.createPhotographer)
router.patch('/photographers/:id', PhotographerCtrl.patchPhotographer)
router.delete('/photographers/:id', PhotographerCtrl.deletePhotographer)

module.exports = router
