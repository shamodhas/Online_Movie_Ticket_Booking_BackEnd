import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import User from "../models/user.model"
import CustomResponse from "../dtos/custom.response"
import * as RegexValidator from "../util/RegexValidator"
import { IUser } from "../types/SchemaTypes"

const DEFAULT_PROFILE_IMAGE =
  "https://your-default-image-url.com/default-profile.png"

export const getAllUsers = async (req: Request, res: Response) => {
  const { size = 10, page = 1 } = req.query as any
  try {
    const users = await User.find()
      .limit(Number(size))
      .skip(Number(size) * (Number(page) - 1))
    const documentCount = await User.countDocuments()
    const pageCount = Math.ceil(documentCount / Number(size))
    return res
      .status(200)
      .json(
        new CustomResponse(
          200,
          "Data found successfully",
          users,
          page,
          pageCount
        )
      )
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).json({ message: "User not found" })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 8)
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      profileImage: DEFAULT_PROFILE_IMAGE
    })

    await user.save()
    user.password = ""
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      req.body,
      { new: true }
    )
    if (!updatedUser) return res.status(404).json({ message: "User not found" })
    res.json(updatedUser)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId)
    if (!deletedUser) return res.status(404).json({ message: "User not found" })
    res.json({ message: "User deleted" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}
