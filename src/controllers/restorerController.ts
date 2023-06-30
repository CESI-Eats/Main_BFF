import { Request, Response } from 'express';
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
        res.status(200).json(responses[0].content);
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
                restorerKitty: req.body.restorerKitty,
                image: req.body.image,
                description: req.body.description,
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

        const responses = await receiveResponses(replyQueue, correlationId, 2);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            return res.status(500).json({errors: failedResponseContents});
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
                image: req.body.image,
                description: req.body.description,
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
        const replyQueue = 'get.restorer.mycatalog.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('restorers', 'get.restorer.mycatalog', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }
        res.status(200).json(responses[0].content);

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
        res.status(200).json(responses[0].content);
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
        res.status(200).json(responses[0].content);
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

export const getAllMyOrders = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.orders.for.restorer.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };

        await publishTopic('historic', 'get.orders.for.restorer', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find user account');
        }
        const orders = responses[0];

        // Get user and restorer infos as well as catalog using a single topic
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
                catalogId: req.params.catalogId,
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                articles: req.body.articles
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalog', 'create.restorer.menu', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot create menu');
        }
        res.status(200).json(responses[0].content);    
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
                catalogId: req.params.catalogId,
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                price: req.body.price,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalog', 'create.restorer.article', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot create article');
        }
        res.status(200).json(responses[0].content);    
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const collectKitty = async (req: Request, res: Response) => {
    if (!req.body.mode) {
        return res.status(400).json({message: 'Missing parameters mode'});
    }
    try {
        const replyQueue = 'collect.restorer.kitty.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId, mode: req.body.mode},
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
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalog', 'update.restorer.catalog', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot update catalog');
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
                catalogId: req.params.catalogId,
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                articles: req.body.articles
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalog', 'update.restorer.menu', message);

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
                catalogId: req.params.catalogId,
                id: req.params.id,
                name: req.body.name,
                description: req.body.description,
                image: req.body.image,
                price: req.body.price
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalog', 'update.restorer.article', message);

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
                catalogId: req.params.catalogId,
                id: req.params.id,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalog', 'delete.restorer.article', message);

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
                catalogId: req.params.catalogId,
                id: req.params.id,
            },
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalog', 'delete.restorer.menu', message);

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