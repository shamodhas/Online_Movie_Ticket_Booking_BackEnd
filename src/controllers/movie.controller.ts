import CustomResponse from "../dtos/custom.response";
import express from "express";

export const getAllMovies = async (
  req: express.Request,
  res: express.Response
) => {};

export const getMovieByName = async (
  req: express.Request,
  res: express.Response
) => {};

export const getMovieByUser = async (
  req: express.Request,
  res: express.Response
) => {};

export const createMovie = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    
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
