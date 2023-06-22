import * as deliverymanController from "../controllers/deliverymanController";
import express from "express";
import {authorize} from "../middlewares/authorizationMiddleware";
import {IdentityType} from "../enums/identityType";

const router = express.Router();

// Get
router.get('/myaccount', authorize([IdentityType.DELIVERYMAN]), deliverymanController.getMyAccount);
router.get('/myorders', authorize([IdentityType.DELIVERYMAN]), deliverymanController.getAllMyCommands);

// Post
router.post('/accounts', authorize([IdentityType.DELIVERYMAN]),  deliverymanController.createAccount);
router.post('/collectkitty', authorize([IdentityType.DELIVERYMAN]), deliverymanController.collectKitty);

// Put
router.put('/orders/:id', authorize([IdentityType.DELIVERYMAN]),  deliverymanController.updateOrder);
router.put('/myaccount', authorize([IdentityType.DELIVERYMAN]),  deliverymanController.updateMyAccount);

// Delete
router.delete('/myaccount', deliverymanController.deleteMyAccount);

export default router;