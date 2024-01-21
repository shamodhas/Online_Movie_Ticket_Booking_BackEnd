import express from "express";
import * as Middleware from "../middlewares";
import * as UserController from "./../controllers/user.controller";

const router = express.Router();

router.get("/all", Middleware.verifyToken, UserController.getAllUser);

router.get("/:email", UserController.getUserByEmail);

router.post("/auth", UserController.authUser);

router.post("/", UserController.registeredUser);

router.put("/:id", Middleware.verifyToken, UserController.updateUser);

router.put(
  "/status/:id",
  Middleware.verifyToken,
  Middleware.verifyIsAdmin,
  UserController.updateUserStatus
);

router.delete("/:id", Middleware.verifyToken, UserController.deleteUser);

export default router;
