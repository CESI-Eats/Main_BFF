import { Request, Response } from 'express';
import {IdentityType} from "../enums/identityType";
import { MessageLapinou, publishTopic, receiveResponses } from '../services/lapinouService';
import { v4 as uuidv4 } from 'uuid';


export const getMyAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.restorer.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'get.restorer.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find account');
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const createAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'create.restorer.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                address: {
                    street: req.body.address.street,
                    postalCode: req.body.address.postalCode,
                    city: req.body.address.city,
                    country: req.body.address.country
                }
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'create.restorer.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find account');
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const updateMyAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'update.restorer.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                address: {
                    street: req.body.address.street,
                    postalCode: req.body.address.postalCode,
                    city: req.body.address.city,
                    country: req.body.address.country
                }
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'update.restorer.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find account');
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};
export const deleteMyAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'delete.restorer.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('users', 'delete.restorer.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            return res.status(404).json({message: 'Cannot delete restorer account'});
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};


export const getMyCatalog = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.restorer.catalog.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'get.restorer.catalog', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }
        res.status(200).json({message: responses[0].content});

    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});    }
};

export const getMenus = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const replyQueue = 'get.restorer.menus.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'get.restorer.menus', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find menus');
        }
        res.status(200).json({message: responses[0].content});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getArticles = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const replyQueue = 'get.restorer.articles.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'get.restorer.articles', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find articles');
        }
        res.status(200).json({message: responses[0].content});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getAllMyOrders = async (req: Request, res: Response) => {
    try {
        const catalogId = req.params.catalogId;
        const id = req.params.id;
        //
    } catch (err) {
        //
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const createMenu = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'create.restorer.menu.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                articles: [],
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'create.restorer.menu', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot create menu');
        }
        res.status(200).json({message: responses[0].content});    
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const createArticle = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'create.restorer.article.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                price: req.body.price,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'create.restorer.article', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot create article');
        }
        res.status(200).json({message: responses[0].content});    
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const collectKitty = async (req: Request, res: Response) => {
    if (!req.body.amount || !req.body.mode) {
        return res.status(400).json({message: 'Missing parameters amount or mode'});
    }
    try {
        const replyQueue = 'collect.restorer.kitty.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId, amount: req.body.amount, mode: req.body.mode},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'collect.restorer.kitty', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            return res.status(500).json({errors: failedResponseContents});
        }

        res.status(200).json({message: 'Kitty collected'});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const updateMyCatalog = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'update.restorer.catalog.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                address: {
                    street: req.body.address.street,
                    postalCode: req.body.address.postalCode,
                    city: req.body.address.city,
                    country: req.body.address.country
                }
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'update.restorer.catalog', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const updateMenu = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'update.restorer.menu.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                article: []
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'update.restorer.menu', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find menu');
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const updateArticle = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'update.restorer.article.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                price: req.body.price
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'update.restorer.article', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find article');
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const deleteAllMyOrders = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const deleteMyOrders = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const deleteArticle = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'delete.restorer.article.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorer', 'delete.restorer.article', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot delete article');
        }
        res.status(200).json({message: responses[0].content});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const deleteMenu = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'delete.restorer.menu.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorer', 'delete.restorer.menu', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot delete menu');
        }
        res.status(200).json({message: responses[0].content});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const setOrderCooked = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'update.order.status.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {orderId: req.body.orderId, status: 'cooked'},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('ordering', 'update.order.status', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            return res.status(404).json({errors: failedResponseContents});
        }

        res.status(200).json({message: 'Order updated'});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};