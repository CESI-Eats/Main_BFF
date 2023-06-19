import express from 'express';
import * as userController from '../controllers/userController';


const router = express.Router();

// Get
router.get('/myaccount', userController.getMyAccount);
router.get('/mycart', userController.getMyCart);
router.get('/catalogs', userController.getAllCatalogs);
router.get('/catalogs/:id', userController.getCatalogs);
router.get('/catalogs/:catalogId/menus/:id', userController.getMenus);

// Post
router.post('/accounts', userController.createAccount);
router.post('/orders', userController.createOrder);

// Put
router.put('/myaccount', userController.updateMyAccount);
router.put('/mycart', userController.updateMyCart);

// Delete
router.delete('/accounts', userController.deleteAccount);
export default router;