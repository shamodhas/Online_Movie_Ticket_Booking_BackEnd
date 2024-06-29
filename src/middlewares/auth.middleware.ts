// <<<<<<< maheeshi-dev
// import { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';
// import config from '../config/jwt'; // Assuming you have a JWT configuration file

// export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
//     const token = req.header('Authorization')?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'Authorization denied. No token provided.' });
//     }

//     try {
//         const decoded = jwt.verify(token, config.secretKey);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         console.error(error);
//         res.status(401).json({ message: 'Token is not valid' });
//     }
// };

import { Request, Response, NextFunction } from "express"
import jwt, { Secret } from "jsonwebtoken"
import config from "../config/jwt"
import User from "../models/user.model"
import { IUser } from "types/SchemaTypes"

interface AuthRequest extends Request {
  user?: IUser
}

export const authenticateUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET as Secret) as {
      userId?: string
    }
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: "Token is not valid" })
  }
}

export const authorizeAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied" })
  }
  next()
}

export const authorizeTheaterOwner = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "theaterOwner") {
    return res.status(403).json({ message: "Access denied" })
  }
  next()
}

export const authorizeCustomer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "customer") {
    return res.status(403).json({ message: "Access denied" })
  }
  next()
}
