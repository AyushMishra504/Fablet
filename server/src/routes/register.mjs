import { Router } from "express";
import { validationResult, checkSchema, matchedData } from "express-validator";
import User from "../mongoose/schemas/newUser.mjs";
import { createUserValidationSchema } from "../utils/validationSchema.mjs";
import { hashPassword } from "../utils/passwordHashing.mjs";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.get("/api/register", (req, res) => {
  res.status(200).send("Create Account");
});

router.post(
  "/api/register",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    //validating the request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).send(errors.array());
    const data = matchedData(req);

    //hashing the password
    data.password = hashPassword(data.password);
    const newUser = new User(data);

    //sending error if email already exists
    const email = data.email;
    const findUserbyEmail = await User.findOne({ email });
    if (findUserbyEmail != null)
      return res.status(409).json({
        message: "Account already exists. Please sign in.",
      });

    //saving user to database
    try {
      const savedUser = await newUser.save();

      //generating jwt token
      const token = generateToken(savedUser._id);
      res.cookie("token", token, {
        httpOnly: true, //
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(201).send(savedUser);
    } catch (err) {
      return res.status(500).json({
        message: err.errmsg,
      });
    }
  },
);

export default router;
