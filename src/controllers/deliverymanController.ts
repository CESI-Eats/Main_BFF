import {Request, Response} from 'express';
import {v4 as uuidv4} from "uuid";
import {MessageLapinou, publishTopic, receiveResponses} from "../services/lapinouService";


type OrderItem = {
    id: string;
    status: string;
    date: string;
    restorer: {
        id: string;
        name: string;
        address: string;
    };
    user: {
        id: string;
        name: string;
        address: string;
    };
    menus: {
        id: string;
        image: string;
        name: string;
    }[];
};

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        const result: OrderItem[] = [];

        // Get historic
        let replyQueue = 'get.orders.for.deliveryman.reply';
        let correlationId = uuidv4();
        let message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('historic', 'get.orders.for.deliveryman', message);
        let responses = await receiveResponses(replyQueue, correlationId, 1);
        let failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            throw new Error(failedResponseContents[0]);
        }
        const ordersResponse = responses.find(m => m.sender == 'order')

        // For each order in historic
        for (let orderString in ordersResponse?.content) {
            const order = JSON.parse(orderString);

            // Get Account
            replyQueue = 'get.accounts.for.deliveryman.reply';
            correlationId = uuidv4();
            message = {
                success: true,
                content: {
                    restorerId: order._idRestorer,
                    userId: order._idUser
                },
                correlationId: correlationId,
                replyTo: replyQueue
            };
            await publishTopic('historic', 'get.accounts.for.deliveryman', message);
            responses = await receiveResponses(replyQueue, correlationId, 1);
            failedResponseContents = responses
                .filter((response) => !response.success)
                .map((response) => response.content);
            if (failedResponseContents.length > 0) {
                throw new Error(failedResponseContents[0]);
            }
            const accountsResponse = responses.find(m => m.sender == 'account')

            // Get menus
            replyQueue = 'get.menus.for.deliveryman.reply';
            correlationId = uuidv4();
            message = {
                success: true,
                content: {
                    restorerId: order._idRestorer
                },
                correlationId: correlationId,
                replyTo: replyQueue
            };
            await publishTopic('historic', 'get.menus.for.deliveryman', message);
            responses = await receiveResponses(replyQueue, correlationId, 1);
            failedResponseContents = responses
                .filter((response) => !response.success)
                .map((response) => response.content);
            if (failedResponseContents.length > 0) {
                throw new Error(failedResponseContents[0]);
            }
            const catalogResponse = responses.find(m => m.sender == 'catalog')

            // Parse the order
            let newOrder: OrderItem = {
                id: order.id,
                status: order.status,
                date: order.date,
                restorer: {
                    id: accountsResponse?.content.restorer.id,
                    name: accountsResponse?.content.restorer.name,
                    address: accountsResponse?.content.restorer.address.street + ' ' + accountsResponse?.content.restorer.address.city,
                },
                user: {
                    id: accountsResponse?.content.user.id,
                    name: accountsResponse?.content.user.name,
                    address: accountsResponse?.content.user.address.street + ' ' + accountsResponse?.content.user.address.city,
                },
                menus: []
            }
            for (const idMenu in order._idMenus) {
                const menuId = order._idMenus[idMenu];
                const menu = catalogResponse?.content.find((m: { id: string }) => m.id === menuId);
                const newMenu = {
                    id: menu.id,
                    image: menu.image,
                    name: menu.name
                }
                newOrder.menus.push(newMenu)
            }
            result.push(newOrder);
        }
        res.status(200).json(result);
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
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const setOrderDelivered = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'update.order.status.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {orderId: req.body.orderId, status: 'delivered'},
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