import express from "express";
import HallModel from "../models/hall.model";
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

export const getHallsByUser = (req: express.Request, res: express.Response) => {};

export const saveHall = (req: express.Request, res: any) => {
  try {
    const req_body: any = req.body;
    const userId = res.tokenData.user._id;

    if (!req_body.hallNumber) {
      res.status(400).send(new CustomResponse(400, "Invalid hall number"));
    }
    // validate data
    else {
      let movie: SchemaTypes.IMovie | null = await MovieModel.findOne({
        name: req_body.name,
      });
      if (movie) {
        res.status(400).send(new CustomResponse(400, "Duplicate movie name"));
      } else {
        const movieModel = new MovieModel({
          name: req_body.name,
          director: req_body.director,
          language: req_body.language,
          description: req_body.description,
          startDate: req_body.startDate,
          endDate: req_body.endDate,
          trailerLink: req_body.trailerLink,
          status: "DEACTIVATE",
          user: new ObjectId(userId),
        });
        await movieModel
          .save()
          .then((modelRes) => {
            res
              .status(200)
              .send(new CustomResponse(200, "Movie saved", modelRes));
          })
          .catch((err) => {
            res.status(500).send(new CustomResponse(500, "Fail to save movie"));
          });
      }
    }
  } catch (err) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const updateHall = (req: express.Request, res: express.Response) => {};

export const deleteHall = (req: express.Request, res: express.Response) => {};
