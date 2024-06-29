// import express from "express";
// import TheaterModel from "../models/theater.model";
// import CustomResponse from "../dtos/custom.response";
// import * as SchemaTypes from "../types/SchemaTypes";
// import { ObjectId } from "mongodb";
// import UserModel from "../models/user.model";
// import * as RegexValidator from "../util/RegexValidator";

// export const getAllTheaters = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     let req_query: any = req.query;
//     let size: number = req_query.size;
//     let page: number = req_query.page;

//     let theaters = await TheaterModel.find()
//       .limit(size)
//       .skip(size * (page - 1));
//     let documentCount = await TheaterModel.countDocuments();

//     let pageCount = Math.ceil(documentCount / size);
//     res
//       .status(200)
//       .send(
//         new CustomResponse(
//           200,
//           "Theaters are found successfully",
//           theaters,
//           pageCount
//         )
//       );
//   } catch (error) {
//     res.status(500).send("Internal Server Error");
//   }
// };

// export const getMyAllTheaters = async (req: express.Request, res: any) => {
//   try {
//     let req_query: any = req.query;
//     let size: number = req_query.size;
//     let page: number = req_query.page;
//     const userId = res.tokenData.user._id;
//     if (!RegexValidator.ValidateObjectId(userId)) {
//       res.status(400).send(new CustomResponse(400, "Invalid user id"));
//     } else {
//       try {
//         let user: any = await UserModel.findById(userId);

//         if (!user) {
//           throw new Error("User not found");
//         } else {
//           let theaters: any = await TheaterModel.find({
//             user: user._id,
//           })
//             .limit(size)
//             .skip(size * (page - 1));
//           let documentCount = await TheaterModel.countDocuments({
//             user: user._id,
//           });
//           let pageCount = Math.ceil(documentCount / size);
//           return res
//             .status(200)
//             .send(
//               new CustomResponse(200, "Theater Founded", theaters, pageCount)
//             );
//         }
//       } catch (err) {
//         return res.status(404).send(new CustomResponse(404, "User not found"));
//       }
//     }
//   } catch (err) {
//     res.status(500).send("Internal Server Error");
//   }
// };

// export const getTheaterByName = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     const name = req.params.name;
//     if (!name) {
//       res.status(400).send(new CustomResponse(400, "Invalid theater name"));
//     } else {
//       let theater: SchemaTypes.ITheater | null = await TheaterModel.findOne({
//         name,
//       });
//       if (theater) {
//         res
//           .status(200)
//           .send(new CustomResponse(200, "Theater Founded", theater));
//       } else {
//         res.status(404).send(new CustomResponse(404, "Theater not found"));
//       }
//     }
//   } catch (err) {
//     res.status(500).send("Internal Server Error");
//   }
// };

// export const getTheatersByUser = async (
//   req: express.Request,
//   res: express.Response
// ) => {
//   try {
//     let req_query: any = req.query;
//     let size: number = req_query.size;
//     let page: number = req_query.page;
//     const userId = req.params.userId;

//     if (!RegexValidator.ValidateObjectId(userId)) {
//       res.status(400).send(new CustomResponse(400, "Invalid user id"));
//     } else {
//       let user: any = await UserModel.findById(userId);

//       if (!user) {
//         res.status(404).send(new CustomResponse(404, "User not found"));
//       } else {
//         let theaters: any = await TheaterModel.find({
//           user: userId,
//         })
//           .limit(size)
//           .skip(size * (page - 1));
//         let documentCount = await TheaterModel.countDocuments({
//           user: user._id,
//         });
//         let pageCount = Math.ceil(documentCount / size);
//         res
//           .status(200)
//           .send(
//             new CustomResponse(200, "Theaters Founded", theaters, pageCount)
//           );
//       }
//     }
//   } catch (err) {
//     res.status(500).send("Internal Server Error");
//   }
// };

// export const saveTheater = async (req: express.Request, res: any) => {
//   try {
//     const req_body: any = req.body;
//     const userId = res.tokenData.user._id;

//     if (!req_body.name) {
//       res.status(400).send(new CustomResponse(400, "Invalid theater name"));
//     }
//     // validate data
//     else {
//       let theater: SchemaTypes.ITheater | null = await TheaterModel.findOne({
//         name: req_body.name,
//       });
//       if (theater) {
//         res.status(400).send(new CustomResponse(400, "Duplicate theater name"));
//       } else {
//         const theaterModel = new TheaterModel({
//           name: req_body.name,
//           location: req_body.location,
//           mobileNumber: req_body.mobileNumber,
//           user: new ObjectId(userId),
//         });
//         await theaterModel
//           .save()
//           .then((modelRes) => {
//             res
//               .status(200)
//               .send(new CustomResponse(200, "Theater saved", modelRes));
//           })
//           .catch((err) => {
//             console.log(err);
//             res
//               .status(500)
//               .send(new CustomResponse(500, "Fail to save theater"));
//           });
//       }
//     }
//   } catch (err) {
//     res.status(500).send(new CustomResponse(500, "Internal Server Error"));
//   }
// };

// export const updateTheater = async (req: express.Request, res: any) => {
//   try {
//     const req_body: any = req.body;
//     const theaterId = req.params.id;
//     const userId = res.tokenData.user._id;
//     const userRole = res.tokenData.user.role;

//     if (RegexValidator.ValidateObjectId(theaterId)) {
//       const theater: SchemaTypes.ITheater | null = await TheaterModel.findById(
//         theaterId
//       );

//       if (!theater)
//         return res
//           .status(404)
//           .send(new CustomResponse(404, "Theater not found"));

//       if (!(theater.user.toString() === userId || userRole === "ADMIN")) {
//         return res
//           .status(400)
//           .send(new CustomResponse(400, "Theater owner not you"));
//       }

//       //validate data

//       theater.name = req_body.name || theater.name;
//       theater.location = req_body.location || theater.location;
//       theater.mobileNumber = req_body.mobileNumber || theater.mobileNumber;

//       let theaterByName: SchemaTypes.ITheater | null =
//         await TheaterModel.findOne({
//           name: req_body.name,
//         });
//       if (
//         theaterByName &&
//         theaterByName._id.toString() !== theater._id.toString()
//       ) {
//         res.status(400).send(new CustomResponse(400, "Duplicate theater name"));
//       } else {
//         const updateResult: any = await TheaterModel.updateOne(
//           { _id: theaterId },
//           theater
//         );

//         if (updateResult.modifiedCount > 0) {
//           res
//             .status(200)
//             .send(new CustomResponse(200, "Theater updated", theater));
//         } else {
//           res
//             .status(400)
//             .send(new CustomResponse(400, "Fail to update theater"));
//         }
//       }
//     } else {
//       res.status(400).send(new CustomResponse(400, "Invalid theater id"));
//     }
//   } catch (error) {
//     res.status(500).send(new CustomResponse(500, "Internal Server Error"));
//   }
// };

// export const deleteTheater = async (req: express.Request, res: any) => {
//   try {
//     const theaterId = req.params.id;
//     const userId = res.tokenData.user._id;
//     const userRole = res.tokenData.user.role;

//     if (RegexValidator.ValidateObjectId(theaterId)) {
//       const theater = await TheaterModel.findById(theaterId);
//       if (theater) {
//         // user usage check
//         if (!(theater.user.toString() === userId || userRole === "ADMIN"))
//           return res
//             .status(400)
//             .send(new CustomResponse(400, "Theater owner not you"));

//         const deleteResult = await TheaterModel.deleteOne({ _id: theaterId });

//         if (deleteResult.deletedCount && deleteResult.deletedCount > 0) {
//           res.status(200).send(new CustomResponse(200, "Theater deleted"));
//         } else {
//           res
//             .status(400)
//             .send(new CustomResponse(400, "Fail to delete theater"));
//         }
//       } else {
//         res.status(404).send(new CustomResponse(404, "Theater not found"));
//       }
//     } else {
//       res.status(400).send(new CustomResponse(400, "Invalid theater id"));
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json(new CustomResponse(500, "Internal Server Error"));
//   }
// };

import { Request, Response } from "express"
import Theater from "../models/theater.model"
import CustomResponse from "./../dtos/custom.response"

export const getAllTheaters = async (req: Request, res: Response) => {
  let req_query: any = req.query
  let size: number = req_query.size
  let page: number = req_query.page

  try {
    const theaters = await Theater.find()
      .limit(size)
      .skip(size * (page - 1))

    let documentCount = await Theater.countDocuments()
    let pageCount = Math.ceil(documentCount / size)

    return res
      .status(200)
      .send(
        new CustomResponse(
          200,
          "User found successfully",
          theaters,
          page,
          pageCount
        )
      )
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getTheaterById = async (req: Request, res: Response) => {
  try {
    const theater = await Theater.findById(req.params.theaterId)
    if (!theater) {
      return res.status(404).json({ message: "Theater not found" })
    }
    res.json(theater)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const createTheater = async (req: Request, res: Response) => {
  const { name, location, seats } = req.body

  try {
    const newTheater = new Theater({ name, location, seats })
    await newTheater.save()
    res.status(201).json(newTheater)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const updateTheater = async (req: Request, res: Response) => {
  try {
    const updatedTheater = await Theater.findByIdAndUpdate(
      req.params.theaterId,
      req.body,
      { new: true }
    )
    if (!updatedTheater) {
      return res.status(404).json({ message: "Theater not found" })
    }
    res.json(updatedTheater)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteTheater = async (req: Request, res: Response) => {
  try {
    const deletedTheater = await Theater.findByIdAndDelete(req.params.theaterId)
    if (!deletedTheater) {
      return res.status(404).json({ message: "Theater not found" })
    }
    res.json({ message: "Theater deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
