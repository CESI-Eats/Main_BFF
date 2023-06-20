import * as deliverymanController from "../controllers/deliverymanController";
import express from "express";
import {authorize} from "../middlewares/authorizationMiddleware";
import {IdentityType} from "../enums/identityType";

const router = express.Router();

// Get
router.get('/myaccount', deliverymanController.getMyAccount);
router.get('/mycommands', deliverymanController.getAllMyCommands);
router.get('/orders/:id', deliverymanController.getMyOrders);

// Post
router.post('/accounts', deliverymanController.createAccount);
router.post('/collectkitty', authorize([IdentityType.DELIVERYMAN]), deliverymanController.collectKitty);

// Put
router.put('/orders/:id', deliverymanController.updateOrder);
router.put('/myaccount', deliverymanController.updateMyAccount);

// Delete
router.delete('/myaccount', deliverymanController.deleteMyAccount);

export default router;