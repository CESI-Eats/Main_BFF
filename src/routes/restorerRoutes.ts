import * as restorerController from "../controllers/restorerController";
import express from "express";
import { authorize } from "../middlewares/authorizationMiddleware";
import { IdentityType } from "../enums/identityType";

const router = express.Router();

// Get
router.get('/myaccount', authorize([IdentityType.RESTORER]),restorerController.getMyAccount);
router.get('/mycatalog', authorize([IdentityType.RESTORER]),restorerController.getMyCatalog);
router.get('/:catalogId/menus/:id', restorerController.getMenus);
router.get('/:catalogId/articles/:id', restorerController.getArticles);
router.get('/myorders', restorerController.getMyOrders);

// Post
router.post('/accounts', authorize([IdentityType.RESTORER]), restorerController.createAccount);
router.post('/:catalogId/menus', authorize([IdentityType.RESTORER]), restorerController.createMenu);
router.post('/:catalogId/articles', authorize([IdentityType.RESTORER]),restorerController.createArticle);
router.post('/collectkitty', authorize([IdentityType.RESTORER]), restorerController.collectKitty);
router.post('/setordercooked', authorize([IdentityType.RESTORER]), restorerController.setOrderCooked);

// Put
router.put('/myaccount', authorize([IdentityType.RESTORER]), restorerController.updateMyAccount);
router.put('/catalog/:id', authorize([IdentityType.RESTORER]), restorerController.updateMyCatalog);
router.put('/:catalogId/menus/:id', authorize([IdentityType.RESTORER]), restorerController.updateMenu);
router.put('/:catalogId/articles/:id', authorize([IdentityType.RESTORER]), restorerController.updateArticle);

// Delete
router.delete('/myaccount', restorerController.deleteMyAccount);
router.delete('/myorders', restorerController.deleteAllMyOrders);
router.delete('/orders/:id', restorerController.deleteMyOrders);
router.delete('/:catalogId/menus/:id', authorize([IdentityType.RESTORER]), restorerController.deleteMenu);
router.delete('/:catalogId/articles/:id', authorize([IdentityType.RESTORER]), restorerController.deleteArticle);

export default router;