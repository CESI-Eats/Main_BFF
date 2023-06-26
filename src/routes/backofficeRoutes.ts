import * as backOfficeController from "../controllers/backOfficeController";
import express from "express";
import {authorize} from "../middlewares/authorizationMiddleware";
import {IdentityType} from "../enums/identityType";

const router = express.Router();

// Get
router.get('/orders', authorize([IdentityType.SALES]), backOfficeController.getOrders);

export default router;