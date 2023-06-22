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
            throw new Error('Cannot find user account');
        }

        // Need to adapt responses to this format:
        const result =
            {
                firstName: '',
                name: '',
                birthday: '',
                phoneNumber: '',
                address: {
                    street: '',
                    postalCode: '',
                    city: '',
                    country: '',
                }
            };

        res.status(200).json(result);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMyCart = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.cart';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('carts', 'get.cart', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find cart');
        }

        // Need to adapt responses to this format:
        const result = {
            name: '',
            price: '',
            menus: [
                {
                    id: '',
                    name: '',
                    description: '',
                    amount: '',
                }
            ]
        }

        res.status(200).json(result);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getCatalogs = async (req: Request, res: Response) => {
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

        const result = [
            {
                id: '',
                image: '',
                name: '',
                description: ''
            }
        ]

        res.status(200).json(result);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMenus = async (req: Request, res: Response) => {
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

        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }

        const result = {
            id: '',
            image: '',
            name: '',
            description: '',
            menus: [
                {
                    id: '',
                    image: '',
                    name: '',
                    description: '',
                    amount: '',
                    articles: [
                        {
                            id: '',
                            name: '',
                        }
                    ]
                }
            ],
        }

        res.status(200).json(result);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMenu = async (req: Request, res: Response) => {

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

        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }

        // Parse data to get only the menu wanted using req.params.id wich the id of the menu
        const result = {
            id: '',
            image: '',
            name: '',
            description: '',
            price: '',
            articles: [
                {
                    id: '',
                    image: '',
                    name: '',
                    description: '',
                    price: ''
                }
            ]
        }

        res.status(200).json(result);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.orders.for.user.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };

        // Need to find an exchange name
        await publishTopic('orders', 'get.orders.for.user', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            throw new Error(failedResponseContents[0]);
        }

        const result = [{
            status: '',
            date: '',
            amount: '',
            restorer: {
                id: '',
                name: '',
                address: ''
            },
            user: {
                id: '',
                name: '',
                address: ''
            },
            menus: [
                {
                    id: '',
                    image: '',
                    name: ''
                }
            ]
        }]

        res.status(200).json(result);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const createAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'create.user.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
                firstName: req.body.form.firstName,
                name: req.body.form.name,
                birthday: req.body.form.birthday,
                phoneNumber: req.body.form.phoneNumber,
                address: {
                    street: req.body.form.street,
                    postalCode: req.body.form.postalCode,
                    city: req.body.form.city,
                    country: req.body.form.country
                }
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('users', 'create.user.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot create user account');
        }
        res.status(200).json({message: responses[0].content});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const submitCart = async (req: Request, res: Response) => {
    if (!req.body.mode) {
        return res.status(400).json({message: 'Missing parameters mode or cartId'});
    }
    try {
        const replyQueue = 'submit.cart.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                _idIdentity: (req as any).identityId,
                mode: req.body.mode
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('ordering', 'submit.cart', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            return res.status(400).json({errors: failedResponseContents});
        }

        res.status(200).json({message: 'Cart submitted, payment successful'});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const updateMyAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'update.user.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
                firstName: req.body.form.firstName,
                name: req.body.form.name,
                birthday: req.body.form.birthday,
                phoneNumber: req.body.form.phoneNumber,
                address: {
                    street: req.body.form.street,
                    postalCode: req.body.form.postalCode,
                    city: req.body.form.city,
                    country: req.body.form.country
                }
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('users', 'update.user.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot create user account');
        }
        res.status(200).json({message: responses[0].content});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const addToMyCart = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'add.to.cart.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
                menu: {
                    id: req.body.menu.id,
                    amount: req.body.menu.amount
                }
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('carts', 'add.to.cart', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot add to cart');
        }
        res.status(200).json({message: responses[0].content});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const removeToMyCart = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'remove.to.cart.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
                menu: {
                    id: req.body.menu.id,
                    amount: req.body.menu.amount
                }
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('carts', 'remove.to.cart', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot add to cart');
        }
        res.status(200).json({message: responses[0].content});
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
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
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};