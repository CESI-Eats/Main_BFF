import * as restorerController from "../controllers/restorerController";
import express from "express";
import { authorize } from "../middlewares/authorizationMiddleware";
import { IdentityType } from "../enums/identityType";

const router = express.Router();

// Get
router.get('/myaccount', authorize([IdentityType.RESTORER]),restorerController.getMyAccount);
router.get('/catalog', restorerController.getMyCatalog);
router.get('/:catalogId/menus/:id', restorerController.getMenus);
router.get('/:catalogId/articles/:id', restorerController.getArticles);
router.get('/myorders', restorerController.getAllMyOrders);
router.get('/orders/:id', restorerController.getMyOrders);

// Post
router.post('/accounts', restorerController.createAccount);
router.post('/:catalogId/menus', restorerController.createMenu);
router.post('/:catalogId/articles', restorerController.createArticle);
router.post('/collectkitty', authorize([IdentityType.RESTORER]), restorerController.collectKitty);
router.post('/setordercooked', authorize([IdentityType.RESTORER]), restorerController.setOrderCooked);

// Put
router.put('/myaccount', restorerController.updateMyAccount);
router.put('/catalog:id', restorerController.updateMyCatalog);
router.put('/:catalogId/menus/:id', restorerController.updateMenu);
router.put('/:catalogId/articles/:id', restorerController.updateArticle);

// Delete
router.delete('/myaccount', restorerController.deleteMyAccount);
router.delete('/myorders', restorerController.deleteAllMyOrders);
router.delete('/orders/:id', restorerController.deleteMyOrders);
router.delete('/:catalogId/menus/:id', restorerController.deleteMenu);
router.delete('/:catalogId/articles/:id', restorerController.deleteArticle);

export default router;