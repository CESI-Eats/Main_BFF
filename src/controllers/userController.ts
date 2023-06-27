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
        const accountResponse = responses.find(m => m.sender == 'account')
        // Need to adapt responses to this format:
        const result =
            {
                firstName: accountResponse?.content.firstName,
                name: accountResponse?.content.name,
                birthday: accountResponse?.content.birthday,
                phoneNumber: accountResponse?.content.phoneNumber,
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

export const getMyCart = async (req: Request, res: Response) => {
    try {
        // Get Cart
        let replyQueue = 'get.cart';
        let correlationId = uuidv4();
        let message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('carts', 'get.cart', message);

        let responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find cart');
        }
        const cart = responses.find(m => m.sender == 'cart')

        // Get Catalog
        replyQueue = 'get.catalog';
        correlationId = uuidv4();
        message = {
            success: true,
            content: {id: cart?.content._idRestorer},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalogs', 'get.catalog', message);

        responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }
        const catalog = responses.find(m => m.sender == 'catalog')

        // Replace menu IDs with catalog menus
        const menus = cart?.content.menus.map((menuId: string) => {
            const menu = catalog?.content.find((m: any) => m.id === menuId);
            if (menu) {
                return {
                    id: menu.id,
                    name: menu.name,
                    description: menu.description,
                    amount: menu.amount
                };
            } else {
                throw new Error(`Menu with ID ${menuId} not found in the catalog`);
            }
        });

        // Construct the result object
        const result = {
            name: catalog?.content.description,
            amount: cart?.content.price,
            menus: menus || []
        };

        res.status(200).json(result);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getCatalogs = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.catalogs';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: null,
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalogs', 'get.catalogs', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const catalog = responses.find(m => m.sender == 'catalog')
        const result = [
            {
                id: catalog?.content.id,
                image: catalog?.content.image,
                name: catalog?.content.name,
                description: catalog?.content.description
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
        const replyQueue = 'get.catalog';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: req.params.id},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalogs', 'get.catalog', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const catalog = responses.find(m => m.sender == 'catalog')

        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }

        // Replace article IDs with catalog articles
        const menus = catalog?.content.menus.map((menu: any) => {
            const articles = menu.articles.map((articleId: string) => {
                const article = catalog?.content.articles.find((a: any) => a.id === articleId);
                if (article) {
                    return {
                        id: article.id,
                        name: article.name
                    };
                } else {
                    throw new Error(`Article with ID ${articleId} not found in the catalog`);
                }
            });
            return {
                id: menu.id,
                image: menu.image,
                name: menu.name,
                description: menu.description,
                amount: menu.amount,
                articles: articles || []
            };
        });

        const result = {
            id: catalog?.content.id,
            image: catalog?.content.image,
            name: catalog?.content.name,
            description: catalog?.content.description,
            menus: menus || []
        };

        res.status(200).json(result);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const getMenu = async (req: Request, res: Response) => {
    try {
        const replyQueue = 'get.catalog';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: req.params.catalogId},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalogs', 'get.catalog', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const catalog = responses.find(m => m.sender == 'catalog')

        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }

        // Find the specific menu using req.params.id
        const menu = catalog?.content.menus.find((m: any) => m.id === req.params.id);
        if (!menu) {
            throw new Error(`Cannot find menu with ID ${req.params.id}`);
        }

        // Replace article IDs with catalog articles
        const articles = menu.articles.map((articleId: string) => {
            const article = catalog?.content.articles.find((a: any) => a.id === articleId);
            if (article) {
                return {
                    id: article.id,
                    image: article.image,
                    name: article.name,
                    description: article.description,
                    price: article.price
                };
            } else {
                throw new Error(`Article with ID ${articleId} not found in the catalog`);
            }
        });

        const result = {
            id: menu.id,
            image: menu.image,
            name: menu.name,
            description: menu.description,
            price: menu.price,
            articles: articles || []
        };

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

        await publishTopic('orders', 'get.orders.for.user', message);

        const responses = await receiveResponses(replyQueue, correlationId, 1);
        const failedResponseContents = responses
            .filter((response) => !response.success)
            .map((response) => response.content);
        if (failedResponseContents.length > 0) {
            throw new Error(failedResponseContents[0]);
        }
        const orders = responses.find(m => m.sender == 'order');

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
        await publishTopic('orders', 'get.users.restorers.and.catalogs', accountAndCatalogMessage);
        const accountAndCatalogResponses = await receiveResponses(accountAndCatalogReplyQueue, accountAndCatalogCorrelationId, 2);
        const accounts = accountAndCatalogResponses.find(m => m.sender == 'account');
        const catalogs = accountAndCatalogResponses.find(m => m.sender == 'catalog');
        // Transform order?.content._idMenus which contains a list of ids into the format wanted
        const menus = orders?.content.map((order: any) => {
            const orderMenus = order._idMenus.map((menuId: string) => {
                const catalog = catalogs?.content.find((c: any) => c.restorerId === order._idRestorer);
                if (catalog) {
                    const menu = catalog.menus.find((m: any) => m.id === menuId);
                    if (menu) {
                        return {
                            id: menu.id,
                            image: menu.image,
                            name: menu.name
                        };
                    } else {
                        throw new Error(`Menu with ID ${menuId} not found in the catalog`);
                    }
                } else {
                    throw new Error(`Catalog not found for restorer with ID ${order._idRestorer}`);
                }
            });
            return {
                status: order.status,
                date: order.date,
                amount: order.amount,
                restorer: {
                    id: accounts?.content.restorers.find((r: any) => r.id === order._idRestorer)?.id,
                    name: accounts?.content.restorers.find((r: any) => r.id === order._idRestorer)?.name,
                    address: accounts?.content.restorers.find((r: any) => r.id === order._idRestorer)?.address
                },
                user: {
                    id: accounts?.content.users.find((u: any) => u.id === order._idUser)?.id,
                    name: accounts?.content.users.find((u: any) => u.id === order._idUser)?.name,
                    address: accounts?.content.users.find((u: any) => u.id === order._idUser)?.address
                },
                menus: orderMenus || []
            };
        });

        res.status(200).json(menus);
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