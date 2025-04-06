// src/routes/indexRouter.ts
import { Router } from "express";
import { usersRouter } from "./usersRouter";
import { appointmentsRouter } from "./appointmentsRouter";
import { credentialsRouter } from "./credentialsRouter";
import { contactRouter } from "./contactRouter";

const router: Router = Router();

// Montamos el usersRouter en la ruta "/user"
router.use("/user", usersRouter);

// Montamos el appointmentsRouter en la ruta "/appointments"
router.use("/appointments", appointmentsRouter);

// Montamos el credentialsRouter en la ruta "/credentials"
router.use("/credentials", credentialsRouter);

// Montamos el contactRouter en la ruta "/contact"
router.use("/contact", contactRouter);

export default router;
