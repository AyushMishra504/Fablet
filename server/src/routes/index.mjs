import { Router } from "express";
import registerRouter from "./register.mjs";
import loginRouter from "./login.mjs";
import mainPage from "./mainPage.mjs";

const router = Router();
router.use(registerRouter);
router.use(loginRouter);
router.use(mainPage);

export default router;
