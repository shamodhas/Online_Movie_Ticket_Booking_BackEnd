import express from "express";
import * as Middleware from "../middlewares";
import * as HallController from "./../controllers/hall.controller";

const router = express.Router();

router.get("/all", Middleware.verifyToken, HallController.getAllHalls);

router.get(
  "/:hallNumber",
  Middleware.verifyToken,
  HallController.getHallByHallNumber
);

router.get(
  "/user/:userId",
  Middleware.verifyToken,
  Middleware.verifyIsAdmin,
  HallController.getHallsByUser
);

router.get(
  "/theater/:theaterId",
  Middleware.verifyToken,
  HallController.getHallsByTheater
);

router.post(
  "/",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  HallController.saveHall
);

router.put(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  HallController.updateHall
); 

router.delete(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  HallController.deleteHall
);

export default router;
