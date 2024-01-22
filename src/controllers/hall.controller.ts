import express from "express";
import HallModel from "../models/hall.model";
import TheaterModel from "../models/theater.model";
import CustomResponse from "../dtos/custom.response";
import * as SchemaTypes from "../types/SchemaTypes";
import { ObjectId } from "mongodb";
import UserModel from "../models/user.model";
import * as RegexValidator from "../util/RegexValidator";

export const getAllHalls = (req: express.Request, res: express.Response) => {};

export const getHallByHallNumber = (
  req: express.Request,
  res: express.Response
) => {};

export const getHallsByUser = (
  req: express.Request,
  res: express.Response
) => {};

export const saveHall = async (req: express.Request, res: any) => {
  try {
    const req_body: any = req.body;
    const userId = res.tokenData.user._id;
    const theaterId = req_body.theater;

    if (!req_body.hallNumber) {
      res.status(400).send(new CustomResponse(400, "Invalid hall number"));
    }
    if (!RegexValidator.ValidateObjectId(theaterId)) {
      res.status(400).send(new CustomResponse(400, "Invalid theater Id"));
    }
    // validate data
    else {
      let hall: SchemaTypes.IHall | null = await HallModel.findOne({
        hallNumber: req_body.hallNumber,
      });
      if (hall) {
        res.status(400).send(new CustomResponse(400, "Duplicate hall number"));
      } else {
        let theater: any = await TheaterModel.findById(theaterId);
        console.log(theater);

        if (theater) {
          const hallModel = new HallModel({
            hallNumber: req_body.hallNumber,
            theater: new ObjectId(theaterId),
            user: new ObjectId(userId),
          });
          await hallModel
            .save()
            .then((modelRes) => {
              res
                .status(200)
                .send(new CustomResponse(200, "Hall saved", modelRes));
            })
            .catch((err) => {
              res
                .status(500)
                .send(new CustomResponse(500, "Fail to save hall"));
            });
        } else {
          res.status(404).send(new CustomResponse(404, "Theater not found"));
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const updateHall = (req: express.Request, res: express.Response) => {};

export const deleteHall = (req: express.Request, res: express.Response) => {};
