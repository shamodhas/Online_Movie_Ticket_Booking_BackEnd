import express from "express";
import HallModel from "../models/hall.model";
import TheaterModel from "../models/theater.model";
import CustomResponse from "../dtos/custom.response";
import * as SchemaTypes from "../types/SchemaTypes";
import { ObjectId } from "mongodb";
import UserModel from "../models/user.model";
import * as RegexValidator from "../util/RegexValidator";

export const getAllHalls = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let req_query: any = req.query;
    let size: number = req_query.size;
    let page: number = req_query.page;

    let halls = await HallModel.find()
      .limit(size)
      .skip(size * (page - 1));
    let documentCount = await HallModel.countDocuments();

    let pageCount = Math.ceil(documentCount / size);
    res
      .status(200)
      .send(
        new CustomResponse(
          200,
          "Halls are found successfully",
          halls,
          pageCount
        )
      );
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getHallByHallNumber = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const hallNumber = req.params.hallNumber;
    if (!hallNumber) {
      res.status(400).send(new CustomResponse(400, "Invalid hall Number"));
    } else {
      let hall: SchemaTypes.IHall | null = await HallModel.findOne({
        hallNumber,
      });
      if (hall) {
        res.status(200).send(new CustomResponse(200, "Hall Founded", hall));
      } else {
        res.status(404).send(new CustomResponse(404, "Hall not found"));
      }
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const getHallsByUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let req_query: any = req.query;
    let size: number = req_query.size;
    let page: number = req_query.page;
    const userId = req.params.userId;
    if (!RegexValidator.ValidateObjectId(userId)) {
      res.status(400).send(new CustomResponse(400, "Invalid user id"));
    } else {
      let user: any = await UserModel.findById(userId);

      if (!user) {
        res.status(404).send(new CustomResponse(404, "User not found"));
      } else {
        let halls: any = await HallModel.find({
          user: userId,
        })
          .limit(size)
          .skip(size * (page - 1));
        let documentCount = await HallModel.countDocuments({
          user: user._id,
        });
        let pageCount = Math.ceil(documentCount / size);
        res
          .status(200)
          .send(new CustomResponse(200, "Halls Founded", halls, pageCount));
      }
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const getHallsByTheater = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let req_query: any = req.query;
    let size: number = req_query.size;
    let page: number = req_query.page;
    const theaterId = req.params.theaterId;

    if (!RegexValidator.ValidateObjectId(theaterId)) {
      res.status(400).send(new CustomResponse(400, "Invalid theater id"));
    } else {
      let theater: any = await TheaterModel.findById(theaterId);

      if (!theater) {
        res.status(404).send(new CustomResponse(404, "Theater not found"));
      } else {
        let halls: any = await HallModel.find({
          theater: theaterId,
        })
          .limit(size)
          .skip(size * (page - 1));
        let documentCount = await HallModel.countDocuments({
          theater: theaterId,
        });
        let pageCount = Math.ceil(documentCount / size);
        res
          .status(200)
          .send(new CustomResponse(200, "Halls Founded", halls, pageCount));
      }
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

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
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const updateHall = async (req: express.Request, res: any) => {
  try {
    const req_body: any = req.body;
    const hallId = req.params.id;
    const userId = res.tokenData.user._id;
    const userRole = res.tokenData.user.role;

    if (RegexValidator.ValidateObjectId(hallId)) {
      const hall: SchemaTypes.IHall | null = await HallModel.findById(hallId);

      if (!hall)
        return res.status(404).send(new CustomResponse(404, "Hall not found"));

      if (!(hall.user.toString() === userId || userRole === "ADMIN"))
        return res
          .status(400)
          .send(new CustomResponse(400, "Hall owner not you"));

      hall.hallNumber = req_body.hallNumber || hall.hallNumber;
      hall.theater = req_body.theater || hall.theater;

      let hallByHallNumber: SchemaTypes.ITheater | null =
        await HallModel.findOne({
          hallNumber: req_body.hallNumber,
        });

      if (
        hallByHallNumber &&
        hallByHallNumber._id.toString() !== hall._id.toString()
      ) {
        res.status(400).send(new CustomResponse(400, "Duplicate hall number"));
      } else {
        const updateResult: any = await HallModel.updateOne(
          { _id: hallId },
          hall
        );

        if (updateResult.modifiedCount > 0) {
          res.status(200).send(new CustomResponse(200, "Hall updated", hall));
        } else {
          res.status(400).send(new CustomResponse(400, "Fail to update hall"));
        }
      }
    } else {
      res.status(400).send(new CustomResponse(400, "Invalid hall id"));
    }
  } catch (error) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const deleteHall = async (req: express.Request, res: any) => {
  try {
    const hallId = req.params.id;
    const userId = res.tokenData.user._id;
    const userRole = res.tokenData.user.role;

    if (RegexValidator.ValidateObjectId(hallId)) {
      const hall = await HallModel.findById(hallId);
      if (hall) {
        // user usage check
        if (!(hall.user.toString() === userId || userRole === "ADMIN"))
          return res
            .status(400)
            .send(new CustomResponse(400, "Hall owner not you"));

        const deleteResult = await HallModel.deleteOne({ _id: hallId });

        if (deleteResult.deletedCount && deleteResult.deletedCount > 0) {
          res.status(200).send(new CustomResponse(200, "Hall deleted"));
        } else {
          res.status(400).send(new CustomResponse(400, "Fail to delete hall"));
        }
      } else {
        res.status(404).send(new CustomResponse(404, "movie not found"));
      }
    } else {
      res.status(400).send(new CustomResponse(400, "Invalid movie id"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(new CustomResponse(500, "Internal Server Error"));
  }
};
