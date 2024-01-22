import express from "express";
import MovieModel from "../models/movie.model";
import CustomResponse from "../dtos/custom.response";
import * as SchemaTypes from "../types/SchemaTypes";
import { ObjectId } from "mongodb";
import UserModel from "../models/user.model";
import * as RegexValidator from "../util/RegexValidator";

export const getAllMovies = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let req_query: any = req.query;
    let size: number = req_query.size;
    let page: number = req_query.page;

    let movies = await MovieModel.find()
      .limit(size)
      .skip(size * (page - 1));
    let documentCount = await MovieModel.countDocuments();

    let pageCount = Math.ceil(documentCount / size);
    res
      .status(200)
      .send(
        new CustomResponse(
          200,
          "Movies are found successfully",
          movies,
          pageCount
        )
      );
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getMovieByName = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const name = req.params.name;
    if (!name) {
      res.status(400).send(new CustomResponse(400, "Invalid movie name"));
    } else {
      let movie: SchemaTypes.IMovie | null = await MovieModel.findOne({
        name,
      });
      if (movie) {
        res.status(200).send(new CustomResponse(200, "Movie Founded", movie));
      } else {
        res.status(404).send(new CustomResponse(404, "Movie not found"));
      }
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const getMoviesByUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let req_query: any = req.query;
    let size: number = req_query.size;
    let page: number = req_query.page;
    const userId = req.params.userId;
    if (!userId) {
      res.status(400).send(new CustomResponse(400, "Invalid user id"));
    } else {
      try {
        let user: any = await UserModel.findById(userId);

        if (!user) {
          throw new Error("User not found");
        } else {
          let movies: any = await MovieModel.find({
            user: userId,
          })
            .limit(size)
            .skip(size * (page - 1));
          let documentCount = await MovieModel.countDocuments({
            user: user._id,
          });
          let pageCount = Math.ceil(documentCount / size);
          res
            .status(200)
            .send(new CustomResponse(200, "Movies Founded", movies, pageCount));
        }
      } catch (err) {
        res.status(404).send(new CustomResponse(404, "User not found"));
      }
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const createMovie = async (req: express.Request, res: any) => {
  try {
    const req_body: any = req.body;
    const userId = res.tokenData.user._id;

    if (!req_body.name) {
      res.status(400).send(new CustomResponse(400, "Invalid movie name"));
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

export const updateMovie = async (req: express.Request, res: any) => {
  try {
    const req_body: any = req.body;
    const movieId = req.params.id;
    const userId = res.tokenData.user._id;
    const userRole = res.tokenData.user.role;

    if (RegexValidator.ValidateObjectId(movieId)) {
      const movie: SchemaTypes.IMovie | null = await MovieModel.findById(
        movieId
      );

      if (!movie)
        return res.status(404).send(new CustomResponse(404, "Movie not found"));

        if (!(movie.user.toString() === userId || userRole === "ADMIN"))
        return res
          .status(400)
          .send(new CustomResponse(400, "Movie owner not you"));

      movie.name = req_body.name || movie.name;
      movie.director = req_body.director || movie.director;
      movie.language = req_body.language || movie.language;
      movie.description = req_body.description || movie.description;
      movie.startDate = req_body.startDate || movie.startDate;
      movie.endDate = req_body.endDate || movie.endDate;
      movie.trailerLink = req_body.trailerLink || movie.trailerLink;
      movie.status = req_body.status || movie.status;

      const updateResult: any = await MovieModel.updateOne(
        { _id: movieId },
        movie
      );

      if (updateResult.modifiedCount > 0) {
        res.status(200).send(new CustomResponse(200, "Movie updated", movie));
      } else {
        res.status(400).send(new CustomResponse(400, "Fail to update movie"));
      }
    } else {
      res.status(400).send(new CustomResponse(400, "Invalid movie id"));
    }
  } catch (error) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const updateMovieStatus = async (req: express.Request, res: any) => {
  try {
    let req_query: any = req.query;
    let status: string = req_query.status;
    const movieId = req.params.id;

    if (RegexValidator.ValidateObjectId(movieId)) {
      const movie: SchemaTypes.IMovie | null = await MovieModel.findById(
        movieId
      );

      if (!movie)
        return res.status(404).send(new CustomResponse(404, "Movie not found"));

      movie.status = status;

      const updateResult: any = await MovieModel.updateOne(
        { _id: movieId },
        movie
      );

      if (updateResult.modifiedCount > 0) {
        res
          .status(200)
          .send(new CustomResponse(200, "Movie status updated", movie));
      } else {
        res
          .status(400)
          .send(new CustomResponse(400, "Fail to update movie status"));
      }
    } else {
      res.status(400).send(new CustomResponse(400, "Invalid movie id"));
    }
  } catch (error) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const deleteMovie = async (req: express.Request, res: any) => {
  try {
    const movieId = req.params.id;
    const userId = res.tokenData.user._id;
    const userRole = res.tokenData.user.role;

    if (RegexValidator.ValidateObjectId(movieId)) {
      const movie = await MovieModel.findById(movieId);
      if (movie) {
        // user usage check
        if (!(movie.user.toString() === userId || userRole === "ADMIN"))
          return res
            .status(400)
            .send(new CustomResponse(400, "Movie owner not you"));

        const deleteResult = await MovieModel.deleteOne({ _id: movieId });

        if (deleteResult.deletedCount && deleteResult.deletedCount > 0) {
          res.status(200).send(new CustomResponse(200, "Movie deleted"));
        } else {
          res.status(400).send(new CustomResponse(400, "Fail to delete movie"));
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
