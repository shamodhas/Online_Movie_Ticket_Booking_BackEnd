import CustomResponse from "../dtos/custom.response";
import express from "express";
import jwt, { Secret } from "jsonwebtoken";
import process from "process";
import * as UserController from "./../controllers/user.controller";
import UserModel from "../models/user.model";
import * as SchemaTypes from "../types/SchemaTypes";

export const verifyToken = async (
  req: express.Request,
  res: any,
  next: express.NextFunction
) => {
  const secret = req.headers.authorization;

  if (!secret) {
    return res.status(401).send(new CustomResponse(401, "Token not provided"));
  }
  const token = secret.substring(7);
  try {
    const data = jwt.verify(token, process.env.SECRET as Secret) as {
      user: { email: string };
    };
    const email = data.user.email;

    const user: SchemaTypes.IUser | null = await UserModel.findOne({
      email,
    });
    // validate tokens data
    if (!user) {
      throw new Error("user email not exists");
    }

    // need change data to user, becorse token data not suver
    res.tokenData = data;
    next();
  } catch (error) {
    return res.status(403).send(new CustomResponse(403, "Invalid token"));
  }
};

export const verifyIsAdmin = (
  req: express.Request,
  res: any,
  next: express.NextFunction
) => {
  try {
    const role = res.tokenData.user.role;
    if (!role || role !== "ADMIN") {
      return res
        .status(403)
        .send(
          new CustomResponse(403, "Permission denied. User is not an admin")
        );
    }
    next();
  } catch (err) {
    return res.status(403).send(new CustomResponse(403, "Invalid token"));
  }
};

export const verifyIsTheaterEmployee = (
  req: express.Request,
  res: any,
  next: express.NextFunction
) => {
  try {
    const role = res.tokenData.user.role;
    if (role !== "THEATER_EMPLOYEE" && role !== "ADMIN") {
      return res
        .status(403)
        .send(
          new CustomResponse(403, "Permission denied. User is not an admin")
        );
    }
    next();
  } catch (err) {
    return res.status(403).send(new CustomResponse(403, "Invalid token"));
  }
};
