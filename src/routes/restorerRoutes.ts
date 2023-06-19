import * as restorerController from "../controllers/restorerController";
import express from "express";

const router = express.Router();

router.get('/myaccount', restorerController.getMyAccount);
router.get('/mycommands', restorerController.getAllMyCommands);
router.get('/commands/:id', restorerController.getMyCommands);
router.get('/mycatalog', restorerController.getMyCatalog);
router.get('/menus/:id', restorerController.getMenus);
router.get('/articles/:id', restorerController.getArticles);
// Put
router.put('/mycatalog', restorerController.updateMyCatalog);
router.put('/menus/:id', restorerController.updateMenus);
router.put('/articles/:id', restorerController.updateArticles);

export default router;