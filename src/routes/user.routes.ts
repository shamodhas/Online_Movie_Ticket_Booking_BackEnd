import express from "express";
import * as Middleware from "../middlewares";
import CustomResponse from "../dtos/custom.response";
import jwt, { Secret } from "jsonwebtoken";
import * as process from "process";
import { IUser } from "types/SchemaTypes";
import * as UserController from "./../controllers/user.controller";

const router = express.Router();

router.get("/all", Middleware.verifyToken, UserController.getAllUser);//

router.get("/:email", UserController.getUserByEmail);//

router.post("/auth", UserController.authUser);//

router.post("/", UserController.registeredUser);//

router.put("/:id", Middleware.verifyToken, UserController.updateUser);

router.delete("/:id", Middleware.verifyToken, UserController.deleteUser);

export default router;
