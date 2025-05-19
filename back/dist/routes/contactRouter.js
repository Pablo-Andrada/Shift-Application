"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = require("express");
const contactController_1 = require("../controllers/contactController");
exports.contactRouter = (0, express_1.Router)();
exports.contactRouter.post("/", contactController_1.handleContactForm);
exports.default = exports.contactRouter;
