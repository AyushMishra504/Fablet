import { Router } from "express";
import registerRouter from "./register.mjs";

const router = Router();
router.use(registerRouter);

export default router;
