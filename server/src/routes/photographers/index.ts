import { Router } from "express";
import photographerController from "../../controllers/photographer";
import photographerService from '../../services/photographer'

const router: Router = Router();
const myPhotographerController = photographerController(photographerService)

router.get("/photographers", myPhotographerController.getAll);
router.get("/available-photographers", myPhotographerController.getAvailablesByDuration);
router.post("/photographers", myPhotographerController.create);
router.patch("/photographers/:id", myPhotographerController.patchById);
router.delete("/photographers/:id", myPhotographerController.deleteById);

export default router;
