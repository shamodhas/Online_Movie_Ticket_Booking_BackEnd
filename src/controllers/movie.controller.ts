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
    console.log('awa')
    res.send('ok')
};

export const updateMovie = async ( 
  req: express.Request,
  res: express.Response
) => {};

export const deleteMovie = async ( // /{id}
  req: express.Request,
  res: express.Response
) => {};
