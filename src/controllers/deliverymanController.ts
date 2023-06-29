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
        const accountResponse = responses[0];


        const result =
            {
                firstName: accountResponse?.content.firstName,
                name: accountResponse?.content.name,
                birthday: accountResponse?.content.birthday,
                phoneNumber: accountResponse?.content.phoneNumber,
                kitty: accountResponse?.content.kitty,
                address: {
                    street: accountResponse?.content.address.street,
                    postalCode: accountResponse?.content.address.postalCode,
                    city: accountResponse?.content.address.city,
                    country: accountResponse?.content.address.country,
                }
            };

        res.status(200).json(result);
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

// Définir les types
type MappedMenu = {
    id: string;
    name: string;
    image: string;
};

type MappedOrder = {
    id: string;
    status: string;
    date: string;
    amount: string;
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
    menus: MappedMenu[];
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
        const orders = responses[0];

        const accountAndCatalogReplyQueue = 'get.users.restorers.and.catalogs';
        const accountAndCatalogCorrelationId = uuidv4();
        const accountAndCatalogMessage: MessageLapinou = {
            success: true,
            content: {
                userIds: orders?.content.map((order: any) => order._idUser),
                restorerIds: orders?.content.map((order: any) => order._idRestorer)
            },
            correlationId: accountAndCatalogCorrelationId,
            replyTo: accountAndCatalogReplyQueue
        };
        await publishTopic('historic', 'get.users.restorers.and.catalogs', accountAndCatalogMessage);
        const accountAndCatalogResponses = await receiveResponses(accountAndCatalogReplyQueue, accountAndCatalogCorrelationId, 2);
        const accounts = accountAndCatalogResponses.find(m => m.sender == 'account');
        const catalogs = accountAndCatalogResponses.find(m => m.sender == 'catalog');

        // MAPPING DATAS
        const ordersData = orders.content;

        const ordersResult: MappedOrder[] = [];

        for (const order of ordersData) {
            const restorerId = order._idRestorer;

            const mappedOrder: MappedOrder = {
                id: order._id,
                status: order.status,
                date: order.date,
                amount: order.amount,
                restorer: {
                    id: '',
                    name: '',
                    address: '',
                },
                user: {
                    id: '',
                    name: '',
                    address: '',
                },
                menus: [],
            };

            // Map restorer details
            const restorer = accounts?.content.restorer;
            mappedOrder.restorer.id = restorer.id;
            mappedOrder.restorer.name = restorer.name;
            mappedOrder.restorer.address = `${restorer.address.street}, ${restorer.address.postalCode} ${restorer.address.city}, ${restorer.address.country}`;

            // Map user details
            const user = accounts?.content.user;
            mappedOrder.user.id = user.id;
            mappedOrder.user.name = `${user.firstName} ${user.name}`;
            mappedOrder.user.address = `${user.address.street}, ${user.address.postalCode} ${user.address.city}, ${user.address.country}`;

            // Map menus
            const catalog = catalogs?.content.find((c: any) => c.restorerId === restorerId);
            const menus = catalog?.menus;
            for (const menuId of order._idMenus) {
                const menu = menus?.find((m: any) => m._id === menuId);
                if (menu) {
                    const mappedMenu: { id: string; name: string; image: string } = {
                        id: menu._id,
                        name: menu.name,
                        image: menu.image,
                    };
                    mappedOrder.menus.push(mappedMenu);
                }
            }
            ordersResult.push(mappedOrder);
        }

        res.status(200).json(ordersResult);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const collectKitty = async (req: Request, res: Response) => {
    if (req.body.amount == null || !req.body.mode) {
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