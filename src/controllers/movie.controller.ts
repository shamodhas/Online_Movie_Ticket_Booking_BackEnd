import express from "express";
import MovieModel from "../models/movie.model";
import CustomResponse from "../dtos/custom.response";
import * as SchemaTypes from "../types/SchemaTypes";
import { ObjectId } from "mongodb";

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

export const getMovieByUser = async (
  req: express.Request,
  res: express.Response
) => {
  const name = req.params.userId;
  console.log("user movie awa");
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

export const updateMovie = async (
  req: express.Request,
  res: express.Response
) => {};

export const deleteMovie = async (
  // /{id}
  req: express.Request,
  res: express.Response
) => {};
