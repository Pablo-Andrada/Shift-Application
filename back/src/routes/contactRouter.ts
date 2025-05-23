import { Router } from "express";
import { handleContactForm } from "../controllers/contactController"; 

export const contactRouter = Router();

contactRouter.post("/", handleContactForm);

export default contactRouter;
