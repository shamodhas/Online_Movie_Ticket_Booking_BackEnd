import express from "express";
import * as Middleware from "../middlewares";
import CustomResponse from "../dtos/custom.response";
import jwt, { Secret } from "jsonwebtoken";
import * as process from "process";
import { IUser } from "types/SchemaTypes";
import * as UserController from "./../controllers/user.controller";

const router = express.Router();

router.get("/all", Middleware.verifyToken, UserController.getAllUser);

router.get("/", (req: express.Request, res: express.Response) => {
  res.send("dfgvf");
});

router.post("/auth", (req: express.Request, res: express.Response) => {
  let request_body = req.body;
  let user = {
    password: "1234",
  }; //: SchemaTypes.Iuser | null = await UserModel.findOne({email: request_body.email});
  if (user) {
    if (user.password === request_body.password) {
      user.password = "";
      jwt.sign(
        { user },
        process.env.SECRET as Secret,
        (err: any, token: any) => {
          if (err) {
            res
              .status(100)
              .send(new CustomResponse(100, "Something went wrong"));
          } else {
            res.status(200).send(
              new CustomResponse(200, "Access", {
                user: user,
                accessToken: token,
              })
            );
          }
        }
      );
    } else {
      res.status(404).send(new CustomResponse(404, "User not found"));
    }
  }
});

router.post("/", (req: express.Request, res: express.Response) => {
  res.send("dfgvf");
});

router.put("/", (req: express.Request, res: express.Response) => {
  res.send("dfgvf");
});

router.delete("/", (req: express.Request, res: express.Response) => {
  res.send("dfgvf");
});

export default router;
