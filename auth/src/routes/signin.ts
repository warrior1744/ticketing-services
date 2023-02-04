import express from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { BadRequestError, validateRequest } from "@jimtickets/common";
import { Password } from "../services/password";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password must not be empty"),
  ],
  validateRequest, //middleware
  async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError("login failed");
    }
    if (user && (await Password.compare(user.password, password))) {
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
      res.status(200).send(user);
    } else {
      throw new BadRequestError("password not match");
    }
  }
);

export { router as signinRouter };
