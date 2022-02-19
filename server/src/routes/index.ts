import { Router } from 'express'
import {
  getPhotographers,
  createPhotographer,
  patchPhotographer,
  deletePhotographer,
} from '../controllers/photographer'

const router: Router = Router()

router.get('/photographers', getPhotographers)
router.post('/photographers', createPhotographer)
router.patch('/photographers/:id', patchPhotographer)
router.delete('/photographers/:id', deletePhotographer)

export default router
