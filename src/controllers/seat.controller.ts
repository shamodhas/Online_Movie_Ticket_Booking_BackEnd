import express from "express";
import CustomResponse from "../dtos/custom.response";
import * as RegexValidator from "../util/RegexValidator";
import * as SchemaTypes from "../types/SchemaTypes";
import HallModel from "../models/hall.model";
import SeatModel from "../models/seat.model";
import { ObjectId } from "mongodb";

export const getAllSeats = async (
  req: express.Request,
  res: express.Response
) => {
    try {
        let req_query: any = req.query;
        let size: number = req_query.size;
        let page: number = req_query.page;
    
        let seats = await SeatModel.find()
          .limit(size)
          .skip(size * (page - 1));
        let documentCount = await SeatModel.countDocuments();
    
        let pageCount = Math.ceil(documentCount / size);
        res
          .status(200)
          .send(
            new CustomResponse(
              200,
              "Seats are found successfully",
              seats,
              pageCount
            )
          );
      } catch (error) {
        res.status(500).send("Internal Server Error");
      }
};

export const getAllSeatsByHall = async (
  req: express.Request,
  res: express.Response
) => {};

export const getSeatsByUser = async (
  req: express.Request,
  res: express.Response
) => {};

export const saveSeat = async (req: express.Request, res: any) => {
  try {
    const req_body: any = req.body;
    const userId = res.tokenData.user._id;
    const hallId = req_body.hall;

    if (!RegexValidator.ValidateObjectId(hallId)) {
      res.status(400).send(new CustomResponse(400, "Invalid Hall Id"));
    }
    // validate data
    else {
      const duplicateSeat = await SeatModel.findOne({
        seatType: req_body.seatType,
        hall: new ObjectId(hallId),
      });
      let hall: SchemaTypes.IHall | null = await HallModel.findById(hallId);

      if (duplicateSeat) {
        res.status(400).send(new CustomResponse(400, "Duplicate seat type"));
      } else if (!hall) {
        res.status(404).send(new CustomResponse(404, "Hall not found"));
      } else {
        const seatModel = new SeatModel({
          seatType: req_body.seatType,
          seatCount: req_body.seatCount,
          price: req_body.price,
          hall: new ObjectId(hallId),
          user: new ObjectId(userId),
        });
        await seatModel
          .save()
          .then((modelRes) => {
            res
              .status(200)
              .send(new CustomResponse(200, "Seat saved", modelRes));
          })
          .catch((err) => {
            res.status(500).send(new CustomResponse(500, "Fail to save seat"));
          });
      }
    }
  } catch (err) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const updateSeat = async (
  req: express.Request,
  res: express.Response
) => {};

export const deleteSeat = async (
  req: express.Request,
  res: express.Response
) => {};
