import { Request, Response } from "express"
import jwt, { Secret } from "jsonwebtoken"
import bcrypt from "bcryptjs"
import config from "../config/jwt"
import User from "../models/user.model"
import CustomResponse from "./../dtos/custom.response"

const generateAccessToken = (username: string) => {
  return jwt.sign({ username }, config.JWT_SECRET as Secret, {
    expiresIn: "45m"
  })
}

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body

  try {
    let user = await User.findOne({ username })

    if (!user) {
      return res
        .status(400)
        .send(new CustomResponse(400, "Invalid credentials"))
    }

    if (user.approvalStatus !== "approved") {
      return res
        .status(401)
        .send(new CustomResponse(401, "Your Account is not activate"))
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res
        .status(400)
        .send(new CustomResponse(400, "Invalid credentials"))
    }

    const accessToken = generateAccessToken(username)

    return res
      .status(200)
      .send(new CustomResponse(200, "Access", { token: accessToken }))
  } catch (error) {
    console.error(error)
    return res.status(500).send(new CustomResponse(500, "Server error"))
  }
}

export const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, role } = req.body

  try {
    let user = await User.findOne({ email })

    if (user) {
      return res
        .status(400)
        .send(new CustomResponse(400, "User already exists"))
    }

    if (role === "Admin") {
      if (!req.header("Authorization")) {
        return res
          .status(401)
          .send(new CustomResponse(401, "Admin user cannot create normal user"))
      }
      const token = req.header("Authorization")?.replace("Bearer ", "")

      if (!token) {
        return res
          .status(401)
          .send(new CustomResponse(401, "Token need for admin regiter"))
      }

      const decoded = jwt.verify(token, config.JWT_SECRET as Secret) as {
        username: string
      }

      const user = await User.findById(decoded.username)

      if (!user) {
        return res.status(403).send(new CustomResponse(403, "Invalid token"))
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    user = new User({
      username,
      email,
      password: hashedPassword,
      role,
      approvalStatus: role === "TheaterOwner" ? "pending" : "approved"
    })
    await user.save()

    return res
      .status(201)
      .send(new CustomResponse(201, "User registered successfully"))
  } catch (error: any) {
    console.error(error.message)
    return res.status(500).send(new CustomResponse(500, "Server error"))
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.header("Authorization")?.replace("Bearer ", "")

  if (!refreshToken) {
    return res.status(401).send(new CustomResponse(401, "No token provided"))
  }

  try {
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET as Secret) as {
      username: string
    }

    const user = await User.findById(decoded.username)

    if (!user) {
      return res
        .status(403)
        .send(new CustomResponse(403, "Invalid refresh token"))
    }

    if (user.approvalStatus !== "approved") {
      return res
        .status(401)
        .send(new CustomResponse(401, "Your Account is not activate"))
    }

    const newAccessToken = generateAccessToken(user.username)

    return res.json({ accessToken: newAccessToken })
  } catch (error) {
    console.error(error)
    return res
      .status(403)
      .send(new CustomResponse(403, "Invalid refresh token"))
  }
}
