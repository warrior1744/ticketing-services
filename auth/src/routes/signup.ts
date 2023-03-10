import express from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from "@jimtickets/common";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 1, max: 24 })
      .withMessage("username too long"),
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 5, max: 20 })
      .withMessage("Password must be at least 5 characters"),
  ],
  validateRequest,
  async (req: express.Request, res: express.Response) => {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email is in use");
    }

    const user = User.build({ username, email, password });
    await user.save();
    //Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!
    );
    //Store it on session object
    req.session = {
      jwt: userJwt,
    };
    res.status(201).send(user);
  }
);

export { router as signupRouter };
