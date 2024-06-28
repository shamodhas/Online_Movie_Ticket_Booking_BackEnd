import express from "express";
import UserModel from "../models/user.model";
import CustomResponse from "../dtos/custom.response";
import * as SchemaTypes from "../types/SchemaTypes";
import * as RegexValidator from "../util/RegexValidator";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getAllUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let req_query: any = req.query;
    let size: number = req_query.size;
    let page: number = req_query.page;

    let users = await UserModel.find()
      .limit(size)
      .skip(size * (page - 1));
    let documentCount = await UserModel.countDocuments();

    let pageCount = Math.ceil(documentCount / size);
    res
      .status(200)
      .send(
        new CustomResponse(
          200,
          "Users are found successfully",
          users,
          pageCount
        )
      );
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getUserByEmail = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const email = req.params.email;
    if (!RegexValidator.validateEmail(email)) {
      res.status(400).send(new CustomResponse(400, "Invalid user email"));
    } else {
      let user: SchemaTypes.IUser | null = await UserModel.findOne({
        email,
      });
      if (user) {
        user.password = "";
        res.status(200).send(new CustomResponse(200, "User Founded", user));
      } else {
        res.status(404).send(new CustomResponse(404, "User not found"));
      }
    }
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

export const authUser = async (req: express.Request, res: express.Response) => {
  try {
    let request_body = req.body;

    let user: SchemaTypes.IUser | null = await UserModel.findOne({
      email: request_body.email,
    });
    if (user) {
      if (!user.status) {
        res
          .status(401)
          .send(new CustomResponse(401, "Your Account is not activate"));
      } else {
        let isMatch = await bcrypt.compare(
          request_body.password,
          user.password
        );
        if (isMatch) {
          user.password = "";
          const expiresIn = "1w";

          jwt.sign(
            { user },
            process.env.SECRET as Secret,
            { expiresIn },
            (err: any, token: any) => {
              if (err) {
                res
                  .status(100)
                  .send(new CustomResponse(500, "Something went wrong"));
              } else {
                let res_body = {
                  user: user,
                  accessToken: token,
                };

                res
                  .status(200)
                  .send(new CustomResponse(200, "Access", res_body));
              }
            }
          );
        } else {
          res.status(401).send(new CustomResponse(401, "Invalid credentials"));
        }
      }
    } else {
      res.status(404).send(new CustomResponse(404, "User not found"));
    }
  } catch (error) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const registeredUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const req_body: any = req.body;

    if (!RegexValidator.validateEmail(req_body.email)) {
      res.status(400).send(new CustomResponse(400, "Invalid user email"));
    }
    // validate data
    else {
      let user: SchemaTypes.IUser | null = await UserModel.findOne({
        email: req_body.email,
      });

      if (user) {
        res.status(400).send(new CustomResponse(400, "Duplicate user email"));
      } else {
        bcrypt.hash(req_body.password, 8, async function (err, hash) {
          if (err) {
            res
              .status(500)
              .send(new CustomResponse(500, "Something went wrong"));
          }
          const userModel = new UserModel({
            name: req_body.name,
            email: req_body.email,
            password: hash,
            mobileNumber: req_body.mobileNumber,
            status: req_body.role === "CUSTOMER" ? true : false,
            role: req_body.role,
          });
          let user: SchemaTypes.IUser | null = await userModel.save();

          if (user) {
            user.password = "";
            res
              .status(200)
              .send(new CustomResponse(200, "User registered", user));
          } else {
            res.status(500).send(new CustomResponse(500, "Fail to save user"));
          }
        });
      }
    }
  } catch (error) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const req_body: any = req.body;
    const userId = req.params.id;

    if (RegexValidator.ValidateObjectId(userId)) {
      const exUser: SchemaTypes.IUser | null = await UserModel.findById(userId);

      if (!exUser)
        return res.status(404).send(new CustomResponse(404, "User not found"));

      exUser.name = req_body.name || exUser.name;
      exUser.email = req_body.email || exUser.email;
      exUser.password =
        (req_body.password && (await bcrypt.hash(req_body.password, 8))) ||
        exUser.password;
      exUser.mobileNumber = req_body.mobileNumber || exUser.mobileNumber;
      exUser.role = req_body.role || exUser.role;

      const updateResult: any = await UserModel.updateOne(
        { _id: userId },
        exUser
      );

      if (updateResult.modifiedCount > 0) {
        exUser.password = "";
        res.status(200).send(new CustomResponse(200, "User updated", exUser));
      } else {
        res.status(400).send(new CustomResponse(400, "Fail to update user"));
      }
    } else {
      res.status(400).send(new CustomResponse(400, "Invalid user id"));
    }
  } catch (error) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const updateUserStatus = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const req_body: any = req.body;
    const userId = req.params.id;

    if (RegexValidator.ValidateObjectId(userId)) {
      const exUser: SchemaTypes.IUser | null = await UserModel.findById(userId);

      if (!exUser)
        return res.status(404).send(new CustomResponse(404, "User not found"));

      exUser.status = req_body.status || exUser.status;

      const updateResult: any = await UserModel.updateOne(
        { _id: userId },
        exUser
      );

      if (updateResult.modifiedCount > 0) {
        exUser.password = "";
        res
          .status(200)
          .send(new CustomResponse(200, "User status updated", exUser));
      } else {
        res
          .status(400)
          .send(new CustomResponse(400, "Fail to update user status"));
      }
    } else {
      res.status(400).send(new CustomResponse(400, "Invalid user id"));
    }
  } catch (error) {
    res.status(500).send(new CustomResponse(500, "Internal Server Error"));
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const userId = req.params.id;
    if (RegexValidator.ValidateObjectId(userId)) {
      const existingUser = await UserModel.findById(userId);
      if (existingUser) {
        // user usage check

        const deleteResult = await UserModel.deleteOne({ _id: userId });
        if (deleteResult.deletedCount && deleteResult.deletedCount > 0) {
          res.status(200).send(new CustomResponse(200, "User deleted"));
        } else {
          res.status(400).send(new CustomResponse(400, "Fail to delete user"));
        }
      } else {
        res.status(404).send(new CustomResponse(404, "User not found"));
      }
    } else {
      res.status(400).send(new CustomResponse(400, "Invalid user id"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(new CustomResponse(500, "Internal Server Error"));
  }
};
