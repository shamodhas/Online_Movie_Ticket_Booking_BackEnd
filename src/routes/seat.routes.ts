import express from "express";
import * as Middleware from "../middlewares";
import * as SeatController from "./../controllers/seat.controller";

const router = express.Router();

router.get("/all", Middleware.verifyToken, SeatController.getAllSeats); //

router.get(
  "/all/:hallId",
  Middleware.verifyToken,
  SeatController.getAllSeatsByHall
); //

router.get(
  "/user/:userId",
  Middleware.verifyToken,
  Middleware.verifyIsAdmin,
  SeatController.getSeatsByUser
); //

router.post(
  "/",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  SeatController.saveSeat
); 

router.put(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  SeatController.updateSeat
); //

router.delete(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  SeatController.deleteSeat
); //

export default router;
