import { Request, Response } from "express"
import Booking from "../models/booking.model"
import CustomResponse from "./../dtos/custom.response"

// Get all bookings
export const getAllBookings = async (req: Request, res: Response) => {
  let req_query: any = req.query
  let size: number = req_query.size
  let page: number = req_query.page

  try {
    const bookings = await Booking.find()
      .limit(size)
      .skip(size * (page - 1))

    let documentCount = await Booking.countDocuments()
    let pageCount = Math.ceil(documentCount / size)

    return res
      .status(200)
      .send(
        new CustomResponse(
          200,
          "Data found successfully",
          bookings,
          page,
          pageCount
        )
      )
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Get booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    res.json(booking)
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}

// Create new booking
export const createBooking = async (req: Request, res: Response) => {
  const { userId, screeningId, seats } = req.body

  try {
    const newBooking = new Booking({ userId, screeningId, seats })
    await newBooking.save()
    res.status(201).json(newBooking)
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const canceledBooking = await Booking.findByIdAndDelete(
      req.params.bookingId
    )
    if (!canceledBooking) {
      return res.status(404).json({ message: "Booking not found" })
    }
    res.json({ message: "Booking canceled" })
  } catch (error: any) {
    console.error(error.message)
    res.status(500).json({ message: "Server error" })
  }
}
