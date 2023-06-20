import {Request, Response} from 'express';
import {IdentityType} from "../enums/identityType";
import {v4 as uuidv4} from "uuid";
import {MessageLapinou, publishTopic, receiveResponses} from "../services/lapinouService";


export const getMyAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.user.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('users', 'get.user.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            return res.status(404).json({message: 'Cannot find restorer account'});
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMyCart = async (req: Request, res: Response) => {
    try {
        // Get /cart with token to filter
        const cart = {
            id: "1235",
            menus: [
                {
                    id: 1,
                    name: "Menu 1",
                    description: "Description du menu 1",
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Article 1"},
                        {id: 2, name: "Article 2"},
                        {id: 3, name: "Article 3"},
                    ],
                },
                {
                    id: 2,
                    name: "Menu 2",
                    description: "Description du menu 2",
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Article 1"},
                        {id: 2, name: "Article 2"},
                        {id: 3, name: "Article 3"},
                    ],
                },
                {
                    id: 3,
                    name: "Menu 3",
                    description: "Description du menu 3",
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Article 1"},
                        {id: 2, name: "Article 2"},
                        {id: 3, name: "Article 3"},
                    ],
                }
            ]
        }
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({message: err});
    }
};

export const getAllCatalogs = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.restorers.accounts.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: null,
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'get.restorers.accounts', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);

        res.status(200).json({message: responses});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getCatalogs = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.restorer.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: req.params.id},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'get.restorer.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);

        res.status(200).json({message: responses});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMenus = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const replyQueue = 'get.restorer.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: req.params.catalogId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'get.restorer.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);

        res.status(200).json({message: responses});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getOrders = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.payments.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('all', 'get.payments', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            return res.status(500).json({errors: failedResponseContents});
        }

        res.status(200).json({message: responses});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getOrder = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.payment.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).params.id},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('all', 'get.payment', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            return res.status(500).json({errors: failedResponseContents});
        }

        res.status(200).json({message: responses});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const createAccount = async (req: Request, res: Response) => {
    try {
        res.status(200).json({message: "Account created"});
    } catch (err) {
        res.status(500).json({message: err});
    }
};

export const createOrder = async (req: Request, res: Response) => {
    if (!req.body.amount || !req.body.mode) {
        return res.status(400).json({message: 'Missing parameters amount or mode'});
    }
    try {
        const replyQueue = 'create.payment.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId, amount: req.body.amount, mode: req.body.mode},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('users', 'create.payment', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            return res.status(500).json({errors: failedResponseContents});
        }

        res.status(200).json({message: 'Payment created'});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const updateMyAccount = async (req: Request, res: Response) => {
    try {
        res.status(200).json({message: "Account updated"});
    } catch (err) {
        res.status(500).json({message: err});
    }
};

export const updateMyCart = async (req: Request, res: Response) => {
    try {
        res.status(200).json({message: "Cart updated"});
    } catch (err) {
        res.status(500).json({message: err});
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'delete.user.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('users', 'delete.user.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            return res.status(404).json({message: 'Cannot delete user account'});
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};