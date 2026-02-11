import { Router } from "express";
import registerRouter from "./register.mjs";
import loginRouter from "./login.mjs";
import dashboard from "./dashboard.mjs";

const router = Router();
router.use(registerRouter);
router.use(loginRouter);
router.use(dashboard);

export default router;
