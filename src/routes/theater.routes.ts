// import express from "express";
// import * as Middleware from "../middlewares";
// import * as TheaterController from "./../controllers/theater.controller";

// const router = express.Router();

// router.get("/all", TheaterController.getAllTheaters);
  
// router.get(
//   "/my",
//   Middleware.verifyToken,
//   Middleware.verifyIsTheaterEmployee,
//   TheaterController.getMyAllTheaters
// );

// router.get("/:name", TheaterController.getTheaterByName);

// router.get(
//   "/user/:userId",
//   Middleware.verifyToken,
//   Middleware.verifyIsAdmin,
//   TheaterController.getTheatersByUser
// );

// router.post(
//   "/",
//   Middleware.verifyToken,
//   Middleware.verifyIsTheaterEmployee,
//   TheaterController.saveTheater
// );

// router.put(
//   "/:id",
//   Middleware.verifyToken,
//   Middleware.verifyIsTheaterEmployee,
//   TheaterController.updateTheater
// );

// router.delete(
//   "/:id",
//   Middleware.verifyToken,
//   Middleware.verifyIsTheaterEmployee,
//   TheaterController.deleteTheater
// );

// export default router;



import express from 'express';
import * as TheaterController from '../controllers/theater.controller';
import { authenticateUser, authorizeAdmin } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', TheaterController.getAllTheaters);
router.get('/:theaterId', TheaterController.getTheaterById);
router.post('/', authenticateUser, authorizeAdmin, TheaterController.createTheater);
router.put('/:theaterId', authenticateUser, authorizeAdmin, TheaterController.updateTheater);
router.delete('/:theaterId', authenticateUser, authorizeAdmin, TheaterController.deleteTheater);

export default router;
