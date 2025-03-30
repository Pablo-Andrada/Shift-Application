"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_js_1 = require("../controllers/contactController.js");
const router = express_1.default.Router();
router.post("/contact", contactController_js_1.handleContactForm);
exports.default = router;
