import { Request, Response } from "express"
import Movie from "../models/movie.model"
import CustomResponse from "../dtos/custom.response"
import { ObjectId } from "mongodb"
import bucket from "../config/firebase"

export const getAllMovies = async (req: Request, res: Response) => {
  const { size = 10, page = 1 } = req.query as any
  try {
    const movies = await Movie.find()
      .limit(Number(size))
      .skip(Number(size) * (Number(page) - 1))
    const documentCount = await Movie.countDocuments()
    const pageCount = Math.ceil(documentCount / Number(size))
    return res
      .status(200)
      .json(
        new CustomResponse(
          200,
          "Data found successfully",
          movies,
          page,
          pageCount
        )
      )
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getAllMyMovies = async (req: Request, res: Response) => {
  const { userId, size = 10, page = 1 } = req.query as any
  try {
    const movies = await Movie.find({ userId })
      .limit(Number(size))
      .skip(Number(size) * (Number(page) - 1))
    const documentCount = await Movie.countDocuments({ userId })
    const pageCount = Math.ceil(documentCount / Number(size))
    return res
      .status(200)
      .json(
        new CustomResponse(
          200,
          "Data found successfully",
          movies,
          page,
          pageCount
        )
      )
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getMovieById = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    res.json(movie)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const createMovie = async (req: Request, res: Response) => {
  if (!req.file)
    return res.status(400).json({ message: "File upload is required." })

  const { userId, title, description, releaseDate, director, status } = req.body
  if (!userId || !title || !description || !releaseDate || !director)
    return res
      .status(400)
      .json({ message: "All required fields must be provided." })

  try {
    const fileName = `movie-booking-system-images/${Date.now()}_${
      req.file.originalname
    }`
    const file = bucket.file(fileName)

    await file.save(req.file.buffer, {
      metadata: { contentType: req.file.mimetype }
    })
    await file.makePublic()

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`

    const newMovie = new Movie({
      userId: new ObjectId(userId),
      title,
      description,
      releaseDate,
      director,
      imageUrl: publicUrl,
      status
    })

    await newMovie.save()
    return res
      .status(201)
      .json(new CustomResponse(201, "Movie created successfully", newMovie))
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err })
  }
}

export const updateMovie = async (req: Request, res: Response) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.movieId,
      req.body,
      { new: true }
    )
    if (!updatedMovie)
      return res.status(404).json({ message: "Movie not found" })
    res.json(updatedMovie)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId)
    if (!deletedMovie)
      return res.status(404).json({ message: "Movie not found" })

    // Delete from Firebase
    if (deletedMovie.imageUrl) {
      const filePath = deletedMovie.imageUrl.split(`${bucket.name}/`)[1]
      if (filePath)
        await bucket
          .file(filePath)
          .delete()
          .catch(() => {})
    }

    res.json({ message: "Movie deleted" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
