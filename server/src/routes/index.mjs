import { Router } from "express";
import registerRouter from "./register.mjs";
import loginRouter from "./login.mjs";
import dashboard from "./dashboard.mjs";
import logout from "./logout.mjs";
import storiesRouter from "./stories.mjs";

const router = Router();
router.use(registerRouter);
router.use(loginRouter);
router.use(dashboard);
router.use(logout);
router.use(storiesRouter);

export default router;
