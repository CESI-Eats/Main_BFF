import * as restorerController from "../controllers/restorerController";
import express from "express";

const router = express.Router();

// Get
router.get('/myaccount', restorerController.getMyAccount);
router.get('/mycatalogs', restorerController.getMyCatalog);
router.get('/menus/:id', restorerController.getMenus);
router.get('/articles/:id', restorerController.getArticles);
router.get('/myorders', restorerController.getAllMyOrders);
router.get('/orders/:id', restorerController.getMyOrders);

// Post
router.post('/accounts', restorerController.createAccount);
router.post('/menus', restorerController.createMenu);
router.post('/articles', restorerController.createArticles);
router.post('/collectkitty', restorerController.collectKitty);

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