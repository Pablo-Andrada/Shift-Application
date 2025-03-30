import { Router } from "express";
import { usersRouter } from "./usersRouter"
import { appointmentsRouter } from "./appointmentsRouter"
import { credentialsRouter } from "./credentialsRouter";
import {contactRouter} from "./contactRouter";
const router: Router = Router()



router.use("/user", usersRouter);
router.use("/appointments", appointmentsRouter);
router.use("/credentials", credentialsRouter);

router.use("/contact", contactRouter); // ruta contact

export default router;