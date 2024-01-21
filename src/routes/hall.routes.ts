import express from "express";
import * as Middleware from "../middlewares";
import * as HallController from "./../controllers/hall.controller";

const router = express.Router();

router.get("/all", HallController.getAllHalls);

router.get("/:hallNumber", HallController.getHallByHallNumber);

router.get("/user/:userId", HallController.getHallsByUser);

router.get("/theater/:theaterId", HallController.getHallsByUser);

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
