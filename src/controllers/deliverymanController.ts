import {Request, Response} from 'express';
import {IdentityType} from "../enums/identityType";
import {v4 as uuidv4} from "uuid";
import {MessageLapinou, publishTopic, receiveResponses} from "../services/lapinouService";

export const getMyAccount = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.deliveryman.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('deliverymans', 'get.deliveryman.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find deliveryman account');
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
        const replyQueue = 'create.deliveryman.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
                firstName: req.body.firstName,
                name: req.body.name,
                birthday: req.body.birthday,
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
        await publishTopic('deliverymans', 'create.deliveryman.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot create deliveryman account');
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
        const replyQueue = 'update.deliveryman.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
                firstName: req.body.firstName,
                name: req.body.name,
                birthday: req.body.birthday,
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
        await publishTopic('deliverymans', 'update.deliveryman.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot update deliveryman account');
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
        const replyQueue = 'delete.deliveryman.account.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {
                id: (req as any).identityId,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('deliverymans', 'delete.deliveryman.account', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot delete deliveryman account');
        }
        res.status(200).json({message: responses[0].content});
    }
    catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.orders.for.deliveryman.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };

        // Need to find an exchange name
        await publishTopic('orders', 'get.orders.for.deliveryman', message);

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


export const updateOrder = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        // Dont know what to send to Order API
        res.status(200).json(id);
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
        const replyQueue = 'collect.deliveryman.kitty.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId, amount: req.body.amount, mode: req.body.mode},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('deliverymans', 'collect.deliveryman.kitty', message);

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
