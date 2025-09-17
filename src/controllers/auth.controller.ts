import { Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User, { IUser } from "../models/user.model"
import CustomResponse from "../dtos/custom.response"
import bucket from "../config/firebase"
import config from "../config/jwt"

// ================= JWT TOKEN =================
const generateAccessToken = (user: IUser) => {
  return jwt.sign(
    { userId: user._id, username: user.email, role: user.role },
    config.JWT_SECRET as Secret,
    { expiresIn: "45m" }
  )
}

// ================= LOGIN =================
export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    const user = await User.findOne({ email: username })
    console.log("USerr--------- ", user)
    if (!user)
      return res
        .status(400)
        .send(new CustomResponse(400, "Invalid credentials"))

    if (user.approvalStatus !== "approved")
      return res
        .status(401)
        .send(new CustomResponse(401, "Your account is not active"))

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res
        .status(400)
        .send(new CustomResponse(400, "Invalid credentials"))

    const accessToken = generateAccessToken(user)

    return res.status(200).send(
      new CustomResponse(200, "Login successful", {
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        status: user.approvalStatus,
        token: accessToken
      })
    )
  } catch (error) {
    console.error(error)
    return res.status(500).send(new CustomResponse(500, "Server error"))
  }
}

// ================= REGISTER =================
export const registerUser = async (req: Request, res: Response) => {
  const { firstName, lastName, email, phone, password } = req.body

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res
        .status(400)
        .send(new CustomResponse(400, "User already exists"))

    // Handle optional profile image
    let profileImageUrl =
      "https://storage.googleapis.com/hyper-tech-425e4.firebasestorage.app/users/1758147178793_default-profile.png"
    if (req.file) {
      const fileName = `users/${Date.now()}_${req.file.originalname}`
      const file = bucket.file(fileName)
      await file.save(req.file.buffer, {
        metadata: { contentType: req.file.mimetype }
      })
      await file.makePublic()
      profileImageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      profileImage: profileImageUrl,
      role: "Customer",
      approvalStatus: "approved"
    })

    await newUser.save()

    return res.status(201).send(
      new CustomResponse(201, "User registered successfully", {
        userId: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        phone: newUser.phone,
        profileImage: newUser.profileImage
      })
    )
  } catch (error: any) {
    console.error(error.message)
    return res.status(500).send(new CustomResponse(500, "Server error"))
  }
}

// ================= REFRESH TOKEN =================
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")
  if (!token)
    return res.status(401).send(new CustomResponse(401, "No token provided"))

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET as Secret) as {
      userId: string
      username: string
      role: string
    }

    const user = await User.findById(decoded.userId)
    if (!user)
      return res
        .status(403)
        .send(new CustomResponse(403, "Invalid refresh token"))

    if (user.approvalStatus !== "approved")
      return res
        .status(401)
        .send(new CustomResponse(401, "Your account is not active"))

    const newAccessToken = generateAccessToken(user)

    return res.status(200).send({ accessToken: newAccessToken })
  } catch (error) {
    console.error(error)
    return res
      .status(403)
      .send(new CustomResponse(403, "Invalid refresh token"))
  }
}
