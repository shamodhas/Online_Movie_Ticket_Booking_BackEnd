import { Request, Response } from "express"
import Seat from "../models/seat.model"
import CustomResponse from "./../dtos/custom.response"

// Get all seats
export const getAllSeats = async (req: Request, res: Response) => {
  let req_query: any = req.query
  let size: number = req_query.size
  let page: number = req_query.page

  try {
    const seats = await Seat.find()
      .limit(size)
      .skip(size * (page - 1))

    let documentCount = await Seat.countDocuments()
    let pageCount = Math.ceil(documentCount / size)

    return res
      .status(200)
      .send(
        new CustomResponse(
          200,
          "Data found successfully",
          seats,
          page,
          pageCount
        )
      )
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Create a new seat
export const createSeat = async (req: Request, res: Response) => {
  const { number, theater } = req.body

  try {
    const newSeat = await Seat.create({ number, theater })
    res.status(201).json(newSeat)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

// Update a seat by ID
export const updateSeat = async (req: Request, res: Response) => {
  const { number, theater } = req.body
  const seatId = req.params.seatId

  try {
    const updatedSeat = await Seat.findByIdAndUpdate(
      seatId,
      { number, theater },
      { new: true }
    )
    if (!updatedSeat) {
      return res.status(404).json({ message: "Seat not found" })
    }
    res.json(updatedSeat)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
}

// Delete a seat by ID
export const deleteSeat = async (req: Request, res: Response) => {
  const seatId = req.params.seatId

  try {
    const deletedSeat = await Seat.findByIdAndDelete(seatId)
    if (!deletedSeat) {
      return res.status(404).json({ message: "Seat not found" })
    }
    res.json({ message: "Seat deleted successfully" })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// import express from "express";
// import CustomResponse from "../dtos/custom.response";
// import * as RegexValidator from "../util/RegexValidator";
// import * as SchemaTypes from "../types/SchemaTypes";
// import HallModel from "../models/hall.model";
// import SeatModel from "../models/seat.model";
// import { ObjectId } from "mongodb";

// export const getAllSeats = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//     try {
//         let req_query: any = req.query;
//         let size: number = req_query.size;
//         let page: number = req_query.page;

//         let seats = await SeatModel.find()
//           .limit(size)
//           .skip(size * (page - 1));
//         let documentCount = await SeatModel.countDocuments();

//         let pageCount = Math.ceil(documentCount / size);
//         res
//           .status(200)
//           .send(
//             new CustomResponse(
//               200,
//               "Seats are found successfully",
//               seats,
//               pageCount
//             )
//           );
//       } catch (error:any) {
//         res.status(500).send("Internal Server Error");
//       }
// };

// export const getAllSeatsByHall = async (
//   req: express.Request,
//   res: express.Response
// ) => {};

// export const getSeatsByUser = async (
//   req: express.Request,
//   res: express.Response
// ) => {};

// export const saveSeat = async (req: express.Request, res: any) => {
//   try {
//     const req_body: any = req.body;
//     const userId = res.tokenData.user._id;
//     const hallId = req_body.hall;

//     if (!RegexValidator.ValidateObjectId(hallId)) {
//       res.status(400).send(new CustomResponse(400, "Invalid Hall Id"));
//     }
//     // validate data
//     else {
//       const duplicateSeat = await SeatModel.findOne({
//         seatType: req_body.seatType,
//         hall: new ObjectId(hallId),
//       });
//       let hall: SchemaTypes.IHall | null = await HallModel.findById(hallId);

//       if (duplicateSeat) {
//         res.status(400).send(new CustomResponse(400, "Duplicate seat type"));
//       } else if (!hall) {
//         res.status(404).send(new CustomResponse(404, "Hall not found"));
//       } else {
//         const seatModel = new SeatModel({
//           seatType: req_body.seatType,
//           seatCount: req_body.seatCount,
//           price: req_body.price,
//           hall: new ObjectId(hallId),
//           user: new ObjectId(userId),
//         });
//         await seatModel
//           .save()
//           .then((modelRes) => {
//             res
//               .status(200)
//               .send(new CustomResponse(200, "Seat saved", modelRes));
//           })
//           .catch((err) => {
//             res.status(500).send(new CustomResponse(500, "Fail to save seat"));
//           });
//       }
//     }
//   } catch (err) {
//     res.status(500).send(new CustomResponse(500, "Internal Server Error"));
//   }
// };

// export const updateSeat = async (
//   req: express.Request,
//   res: express.Response
// ) => {};

// export const deleteSeat = async (
//   req: express.Request,
//   res: express.Response
// ) => {};
