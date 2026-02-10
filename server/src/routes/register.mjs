import { Router } from "express";
import { validationResult, checkSchema, matchedData } from "express-validator";
import User from "../mongoose/schemas/newUser.mjs";
import createUserValidationSchema from "../utils/validationSchema.mjs";
import { hashPassword } from "../utils/passwordHashing.mjs";

const router = Router();

router.get("/api/register", (req, res) => {
  console.log("Now in sign in page!");
  res.status(200).send("Create Account");
});

router.post(
  "/api/register",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) return res.status(400).send(errors.array());

    const data = matchedData(req);
    data.password = hashPassword(data.password);
    const newUser = new User(data);

    try {
      const savedUser = await newUser.save();
      return res.status(201).send(savedUser);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        message: err.message || "Internal Server Error",
      });
    }
  },
);

export default router;
