import { Request, Response } from "express"
import Movie from "../models/movie.model"
import CustomResponse from "./../dtos/custom.response"

export const getAllMovies = async (req: Request, res: Response) => {
  let req_query: any = req.query
  let size: number = req_query.size
  let page: number = req_query.page

  try {
    const movies = await Movie.find()
      .limit(size)
      .skip(size * (page - 1))

    let documentCount = await Movie.countDocuments()
    let pageCount = Math.ceil(documentCount / size)

    return res
      .status(200)
      .send(
        new CustomResponse(
          200,
          "Data found successfully",
          movies,
          page,
          pageCount
        )
      )
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" })
    }
    res.json(movie)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const createMovie = async (req: Request, res: Response) => {
  const { title, description, releaseDate, director } = req.body

  try {
    const newMovie = new Movie({ title, description, releaseDate, director })
    await newMovie.save()
    res.status(201).json(newMovie)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.movieId,
      req.body,
      { new: true }
    )
    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" })
    }
    res.json(updatedMovie)
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId)
    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" })
    }
    res.json({ message: "Movie deleted" })
  } catch (error) {
    res.status(500).json({ message: "Server error" })
  }
}
