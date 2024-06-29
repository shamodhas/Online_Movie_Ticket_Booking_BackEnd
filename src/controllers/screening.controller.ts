import { Request, Response } from "express"
import Screening from "../models/screening.model"
import CustomResponse from "./../dtos/custom.response"

// Get all screenings
export const getAllScreenings = async (req: Request, res: Response) => {
  let req_query: any = req.query
  let size: number = req_query.size
  let page: number = req_query.page

  try {
    const screenings = await Screening.find()
      .limit(size)
      .skip(size * (page - 1))

    let documentCount = await Screening.countDocuments()
    let pageCount = Math.ceil(documentCount / size)

    return res
      .status(200)
      .send(
        new CustomResponse(
          200,
          "Data found successfully",
          screenings,
          page,
          pageCount
        )
      )
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get screening by ID
export const getScreeningById = async (req: Request, res: Response) => {
  try {
    const screening = await Screening.findById(req.params.screeningId)
    if (!screening) {
      return res.status(404).json({ message: "Screening not found" })
    }
    res.json(screening)
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Create new screening
export const createScreening = async (req: Request, res: Response) => {
  const { movieId, theaterId, startTime, endTime } = req.body

  try {
    const newScreening = new Screening({
      movieId,
      theaterId,
      startTime,
      endTime
    })
    await newScreening.save()
    res.status(201).json(newScreening)
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Update screening by ID
export const updateScreening = async (req: Request, res: Response) => {
  try {
    const updatedScreening = await Screening.findByIdAndUpdate(
      req.params.screeningId,
      req.body,
      { new: true }
    )
    if (!updatedScreening) {
      return res.status(404).json({ message: "Screening not found" })
    }
    res.json(updatedScreening)
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete screening by ID
export const deleteScreening = async (req: Request, res: Response) => {
  try {
    const deletedScreening = await Screening.findByIdAndDelete(
      req.params.screeningId
    )
    if (!deletedScreening) {
      return res.status(404).json({ message: "Screening not found" })
    }
    res.json({ message: "Screening deleted" })
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}
