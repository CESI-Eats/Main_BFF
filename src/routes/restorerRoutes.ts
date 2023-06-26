import * as restorerController from "../controllers/restorerController";
import express from "express";
import { authorize } from "../middlewares/authorizationMiddleware";
import { IdentityType } from "../enums/identityType";

const router = express.Router();

// Get
router.get('/myaccount', authorize([IdentityType.RESTORER]),restorerController.getMyAccount);
router.get('/mycatalogs', restorerController.getMyCatalog);
router.get('/menus/:id', restorerController.getMenus);
router.get('/articles/:id', restorerController.getArticles);
router.get('/myorders', restorerController.getAllMyOrders);
router.get('/orders/:id', restorerController.getMyOrders);

// Post
router.post('/accounts', restorerController.createAccount);
router.post('/menus', restorerController.createMenu);
router.post('/articles', restorerController.createArticle);
router.post('/collectkitty', authorize([IdentityType.RESTORER]), restorerController.collectKitty);
router.post('/setordercooked', authorize([IdentityType.RESTORER]), restorerController.setOrderCooked);

// Put
router.put('/myaccount', restorerController.updateMyAccount);
router.put('/mycatalogs', restorerController.updateMyCatalog);
router.put('/menus/:id', restorerController.updateMenu);
router.put('/articles/:id', restorerController.updateArticles);

// Delete
router.put('/myaccount', restorerController.deleteMyAccount);
router.put('/myorders', restorerController.deleteAllMyOrders);
router.put('/orders/:id', restorerController.deleteMyOrders);
export default router;