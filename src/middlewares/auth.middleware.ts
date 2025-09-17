import { Request, Response, NextFunction } from "express"
import jwt, { Secret } from "jsonwebtoken"
import config from "../config/jwt"
import User from "../models/user.model"
import { IUser } from "types/SchemaTypes"

interface AuthRequest extends Request {
  user?: IUser
}

// -------------------- Authenticate JWT --------------------
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
      username?: string
    }

    console.log(decoded)

    if (!decoded.username) {
      return res.status(401).json({ message: "Token payload invalid" })
    }

    const user: IUser | null = await User.findOne({ email: decoded.username })

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error(error)
    return res.status(401).json({ message: "Token is not valid" })
  }
}

// -------------------- Role-based Authorization --------------------
export const authorizeRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" })
    }
    next()
  }
}

// Shortcut for common roles
export const authorizeAdmin = authorizeRole(["Admin"])
export const authorizeTheaterOwner = authorizeRole(["Admin", "TheaterOwner"])
export const authorizeCustomer = authorizeRole(["Customer"])

// // <<<<<<< maheeshi-dev
// // import { Request, Response, NextFunction } from 'express';
// // import jwt from 'jsonwebtoken';
// // import config from '../config/jwt'; // Assuming you have a JWT configuration file

// // export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
// //     const token = req.header('Authorization')?.split(' ')[1];

// //     if (!token) {
// //         return res.status(401).json({ message: 'Authorization denied. No token provided.' });
// //     }

// //     try {
// //         const decoded = jwt.verify(token, config.secretKey);
// //         req.user = decoded;
// //         next();
// //     } catch (error) {
// //         console.error(error);
// //         res.status(401).json({ message: 'Token is not valid' });
// //     }
// // };

// import { Request, Response, NextFunction } from "express"
// import jwt, { Secret } from "jsonwebtoken"
// import config from "../config/jwt"
// import User from "../models/user.model"
// import { IUser } from "types/SchemaTypes"

// interface AuthRequest extends Request {
//   user?: IUser
// }

// export const authenticateUser = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   const token = req.header("Authorization")?.replace("Bearer ", "")

//   if (!token) {
//     return res.status(401).json({ message: "No token, authorization denied" })
//   }

//   try {
//     const decoded = jwt.verify(token, config.JWT_SECRET as Secret) as {
//       username?: string
//     }
//     const user = await User.findOne({ username: decoded.username })

//     if (!user) {
//       return res.status(401).json({ message: "User not found" })
//     }

//     req.user = user
//     next()
//   } catch (error) {
//     console.error(error)
//     res.status(401).json({ message: "Token is not valid" })
//   }
// }

// export const authorizeAdmin = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.user?.role !== "Admin") {
//     return res.status(403).json({ message: "Access denied" })
//   }
//   next()
// }

// export const authorizeTheaterOwner = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.user?.role !== "TheaterOwner") {
//     return res.status(403).json({ message: "Access denied" })
//   }
//   next()
// }

// export const authorizeCustomer = (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ) => {
//   if (req.user?.role !== "Customer") {
//     return res.status(403).json({ message: "Access denied" })
//   }
//   next()
// }
