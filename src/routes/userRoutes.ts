import express from 'express';
import * as userController from '../controllers/userController';
import {authorize} from "../middlewares/authorizationMiddleware";
import {IdentityType} from "../enums/identityType";


const router = express.Router();

// Get
router.get('/myaccount', userController.getMyAccount);
router.get('/mycart', userController.getMyCart);
router.get('/catalogs', userController.getCatalogs);
router.get('/catalogs/:id', userController.getMenus);
router.get('/catalogs/:catalogId/menus/:id', userController.getMenu);
router.get('/orders', userController.getOrders)

// Post
router.post('/accounts', userController.createAccount);
router.post('/orders',authorize([IdentityType.USER]), userController.submitCart);

// Put
router.put('/myaccount', userController.updateMyAccount);
router.put('/addtomycart', userController.addToMyCart);
router.put('/removetomycart', userController.removeToMyCart);

// Delete
router.delete('/accounts', userController.deleteAccount);
export default router;