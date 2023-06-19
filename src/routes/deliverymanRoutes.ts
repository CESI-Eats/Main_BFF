import * as deliverymanController from "../controllers/deliverymanController";
import express from "express";

const router = express.Router();

router.get('/myaccount', deliverymanController.getMyAccount);
router.get('/mycommands', deliverymanController.getAllMyCommands);
router.get('/commands/:id', deliverymanController.getMyCommands);

export default router;