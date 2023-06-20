import express from 'express';
import * as userController from '../controllers/userController';
import {authorize} from "../middlewares/authorizationMiddleware";
import {IdentityType} from "../enums/identityType";


const router = express.Router();

// Get
router.get('/myaccount', userController.getMyAccount);
router.get('/mycart', userController.getMyCart);
router.get('/catalogs', userController.getAllCatalogs);
router.get('/catalogs/:id', userController.getCatalogs);
router.get('/catalogs/:catalogId/menus/:id', userController.getMenus);
router.get('/orders', userController.getOrders)
router.get('/orders/:id', userController.getOrder)

// Post
router.post('/accounts', userController.createAccount);
router.post('/orders',authorize([IdentityType.USER]), userController.createOrder);

// Put
router.put('/myaccount', userController.updateMyAccount);
router.put('/mycart', userController.updateMyCart);

// Delete
router.delete('/accounts', userController.deleteAccount);
export default router;