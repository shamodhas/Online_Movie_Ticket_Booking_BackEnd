import express from "express";
import jwt, { Secret } from "jsonwebtoken";
import process from "process";

export const verifyToken = (
  req: express.Request,
  res: any,
  next: express.NextFunction
) => {
  const secret = req.headers.authorization;

  if (!secret) {
    return res.status(401).json("Token empty");
  }
  const token = secret.substring(7);
  try {
    const data = jwt.verify(token, process.env.SECRET as Secret);
    res.tokenData = data;
    next();
  } catch (error) {
    return res.status(401).json("Invalid token");
  }
};
