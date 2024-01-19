import express from "express";
import UserModel from "../models/user.model";
import CustomResponse from "../dtos/custom.response";
import * as SchemaTypes from "../types/SchemaTypes";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongoose";
import { error } from "console";

export const getAllUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let users = await UserModel.find();
    res
      .status(200)
      .send(new CustomResponse(200, "Users are found successfully", users));
  } catch (error) {
    res.status(100).send("Error");
  }
};

export const getUserByEmail = async (
  req: express.Request,
  res: express.Response
) => {
  let user: SchemaTypes.IUser | null = await UserModel.findOne({
    email: req.params.email,
  });
  if (user) {
    user.password = "";
    res.status(200).send(new CustomResponse(200, "User Found", user));
  } else {
    res.status(404).send(new CustomResponse(404, "User not found"));
  }
};

export const authUser = async (req: express.Request, res: express.Response) => {
  try {
    let request_body = req.body;

    let user: SchemaTypes.IUser | null = await UserModel.findOne({
      email: request_body.email,
    });
    if (user) {
      let isMatch = await bcrypt.compare(request_body.password, user.password);
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
                .send(new CustomResponse(100, "Something went wrong"));
            } else {
              let res_body = {
                user: user,
                accessToken: token,
              };

              res.status(200).send(new CustomResponse(200, "Access", res_body));
            }
          }
        );
      } else {
        res.status(401).send(new CustomResponse(401, "Invalid credentials"));
      }
    } else {
      res.status(404).send(new CustomResponse(404, "User not found"));
    }
  } catch (error) {
    res.status(100).send("Error");
  }
};

export const registeredUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const req_body: any = req.body;

    bcrypt.hash(req_body.password, 8, async function (err, hash) {
      if (err) {
        res.status(100).send(new CustomResponse(100, "Something went wrong"));
      }
      const userModel = new UserModel({
        name: req_body.name,
        email: req_body.email,
        password: hash,
        mobileNumber: req_body.mobileNumber,
        role: req_body.role,
      });
      let user: SchemaTypes.IUser | null = await userModel.save();

      if (user) {
        user.password = "";
        res
          .status(200)
          .send(new CustomResponse(200, "User registered successfully", user));
      } else {
        res.status(100).send(new CustomResponse(100, "Something went wrong."));
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(new CustomResponse(500, "Internal Server Error"));
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const req_body: any = req.body;
    const userId = req.params.id;
    const validationRegex = new RegExp("^[0-9a-fA-F]{24}$");

    if (validationRegex.test(userId)) {
      const exUser: SchemaTypes.IUser | null = await UserModel.findById(userId);

      if (!exUser)
        return res.status(400).send(new CustomResponse(400, "User not found"));

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
      res.status(404).send(new CustomResponse(404, "Invalid user id"));
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
    const req_body: any = req.body;
    const userId = req.params.id;

    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      return res.status(404).json(new CustomResponse(404, "User not found"));
    }

    let hashedPassword;
    if (req_body.password) {
      hashedPassword = await bcrypt.hash(req_body.password, 8);
    }

    existingUser.name = req_body.name || existingUser.name;
    existingUser.email = req_body.email || existingUser.email;
    existingUser.password = hashedPassword || existingUser.password;
    existingUser.mobileNumber =
      req_body.mobileNumber || existingUser.mobileNumber;
    existingUser.role = req_body.role || existingUser.role;

    const updatedUser = await existingUser.save();

    if (updatedUser) {
      updatedUser.password = "";
      res
        .status(200)
        .json(
          new CustomResponse(200, "User updated successfully", updatedUser)
        );
    } else {
      res.status(500).json(new CustomResponse(500, "Internal Server Error"));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(new CustomResponse(500, "Internal Server Error"));
  }
};
