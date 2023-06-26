import * as backOfficeController from "../controllers/backOfficeController";
import express from "express";
import {authorize} from "../middlewares/authorizationMiddleware";
import {IdentityType} from "../enums/identityType";

const router = express.Router();

// Get
router.get('/orders', authorize([IdentityType.SALES]), backOfficeController.getOrders);
router.get('/payments', authorize([IdentityType.SALES]), backOfficeController.getPayments);

export default router;