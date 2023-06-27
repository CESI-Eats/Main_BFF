import express from 'express';
import * as userController from '../controllers/userController';
import {authorize} from "../middlewares/authorizationMiddleware";
import {IdentityType} from "../enums/identityType";
import {getMyOrders} from "../controllers/deliverymanController";


const router = express.Router();

// Get
router.get('/myaccount', authorize([IdentityType.USER]), userController.getMyAccount);
router.get('/mycart', authorize([IdentityType.USER]), userController.getMyCart);
router.get('/catalogs', authorize([IdentityType.USER]), userController.getCatalogs);
router.get('/catalogs/:id', authorize([IdentityType.USER]), userController.getMenus);
router.get('/catalogs/:catalogId/menus/:id', authorize([IdentityType.USER]), userController.getMenu);
router.get('/myorders', authorize([IdentityType.USER]), userController.getMyOrders)

// Post
router.post('/accounts', authorize([IdentityType.USER]), userController.createAccount);
router.post('/orders', authorize([IdentityType.USER]), authorize([IdentityType.USER]), userController.submitCart);

// Put
router.put('/myaccount', authorize([IdentityType.USER]), userController.updateMyAccount);
router.put('/addtomycart', authorize([IdentityType.USER]), userController.addToMyCart);
router.put('/removetomycart', authorize([IdentityType.USER]), userController.removeToMyCart);

// Delete
router.delete('/accounts', authorize([IdentityType.USER]), userController.deleteAccount);
export default router;