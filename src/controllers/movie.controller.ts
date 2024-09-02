import { Request, Response } from "express"
import Movie from "../models/movie.model"
import CustomResponse from "./../dtos/custom.response"
import multer from "multer"
import path from "path"
import fs from "fs"
import mongoose from "mongoose"
import { ObjectId } from "mongodb"
import s3 from "../config/s3Config"

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

export const getAllMyMovies = async (req: Request, res: Response) => {
  let req_query: any = req.query
  let userId: number = req_query.userId
  let size: number = req_query.size
  let page: number = req_query.page

  try {
    const movies = await Movie.find()
      .limit(size)
      .skip(size * (page - 1))

    let documentCount = await Movie.countDocuments({ userId })
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
  console.log(req)
  if (!req.file) {
    return res.status(400).json({ message: "File upload is required." })
  }

  const { userId, title, description, releaseDate, director, status } = req.body

  // Validate required fields
  if (!userId || !title || !description || !releaseDate || !director) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." })
  }

  try {
    const params = {
      Bucket: "online.mtbs.mern",
      Key: `${Date.now()}_${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    }

    const s3Response = await s3.upload(params).promise()

    // Create a new movie document
    const newMovie = new Movie({
      userId: new ObjectId(userId),
      title,
      description,
      releaseDate,
      director,
      imageUrl: s3Response.Location,
      status
    })

    // Save the movie to the database
    await newMovie.save()

    // Send a successful response
    return res
      .status(201)
      .send(new CustomResponse(201, "Movie created successfully", newMovie))
  } catch (error) {
    // Delete uploaded file if saving to database fails
    if (req.file) {
      fs.unlinkSync(path.join(__dirname, "../uploads/", req.file.filename))
    }
    res.status(500).json({ message: "Server error", error })
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
