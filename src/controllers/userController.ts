import {Request, Response} from 'express';
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
        const accountResponse = responses[0];
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
        const cart = responses[0]

        // Get Catalog
        replyQueue = 'get.catalog.by.restorer';
        correlationId = uuidv4();
        message = {
            success: true,
            content: {idRestorer: cart.content._idRestorer},
            correlationId: correlationId,
            replyTo: replyQueue
        };
        await publishTopic('catalogs', 'get.catalog.by.restorer', message);

        responses = await receiveResponses(replyQueue, correlationId, 1);
        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }
        const catalog = responses[0]

        const menus = cart.content.menus.map((menuId: string) => {
            const menu = catalog.content.menus.find((m: any) => m._id === menuId);
            if (menu) {
                return {
                    id: menu._id,
                    name: menu.name,
                    description: menu.description,
                    image: menu.image,
                    amount: menu.amount
                };
            } else {
                throw new Error(`Menu with ID ${menuId} not found in the catalog`);
            }
        });

        const result = {
            id: cart?.content._id,
            name: catalog?.content.name,
            amount: cart?.content.price,
            menus: menus || []
        };
        console.log(JSON.stringify(result))
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
        // Map the received content to the updated data structure
        const result = catalog?.content.map((item: any) => {
            return {
                id: item._id,
                restorerId: item.restorerId,
                image: item.image,
                name: item.name,
                description: item.description
            };
        });

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
        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }
        const catalog = responses[0];
        const menus = catalog?.content.menus.map((menu: any) => {
            const amount = menu.articles.reduce((sum: number, articleId: string) => {
                const article = catalog?.content.articles.find((a: any) => a._id === articleId);
                if (article) {
                    return sum + article.price;
                } else {
                    throw new Error(`Article with ID ${articleId} not found in the catalog`);
                }
            }, 0);
            return {
                id: menu._id,
                image: menu.image,
                name: menu.name,
                description: menu.description,
                amount: amount,
                articles: menu.articles.map((articleId: string) => {
                    const article = catalog?.content.articles.find((a: any) => a._id === articleId);
                    if (article) {
                        return {
                            id: article._id,
                            name: article.name
                        };
                    } else {
                        throw new Error(`Article with ID ${articleId} not found in the catalog`);
                    }
                })
            };
        });

        const result = {
            id: catalog?.content._id,
            restorerId: catalog?.content.restorerId,
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
        if (!responses[0].success) {
            throw new Error('Cannot find catalog');
        }
        const catalog = responses[0]

        // Find the specific menu using req.params.id
        const menu = catalog?.content.menus.find((m: any) => m._id === req.params.id);
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
                    amount: article.price
                };
            } else {
                throw new Error(`Article with ID ${articleId} not found in the catalog`);
            }
        });
        const amount = menu.articles.reduce((sum: number, articleId: string) => {
            const article = catalog?.content.articles.find((a: any) => a._id === articleId);
            if (article) {
                return sum + article.price;
            } else {
                throw new Error(`Article with ID ${articleId} not found in the catalog`);
            }
        }, 0);
        const result = {
            id: menu._id,
            restorerId: catalog?.content.restorerId,
            image: menu.image,
            name: menu.name,
            description: menu.description,
            amount: amount,
            articles: articles || []
        };

        res.status(200).json(result);
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
        const replyQueue = 'get.orders.for.user.reply';
        const correlationId = uuidv4();
        const message: MessageLapinou = {
            success: true,
            content: {id: (req as any).identityId},
            correlationId: correlationId,
            replyTo: replyQueue
        };

        await publishTopic('historic', 'get.orders.for.user', message);

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

        console.log("***Orders " + JSON.stringify(orders));
        console.log("***Accounts " + JSON.stringify(accounts));
        console.log("***Catalogs " + JSON.stringify(catalogs));

        // MAPPING DATAS


        // MAPPING DATAS
        const ordersData = orders.content;

        const ordersResult: MappedOrder[] = [];

        for (const order of ordersData) {
            const restorerId = order._idRestorer;

            const mappedOrder: MappedOrder = {
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
            for (const menu of menus) {
                const mappedMenu: { id: string, name: string, image: string } = {
                    id: menu._id,
                    name: menu.name,
                    image: menu.image,
                };
                mappedOrder.menus.push(mappedMenu);
            }

            ordersResult.push(mappedOrder);
        }

        res.status(200).json(ordersResult);
    } catch (err) {
        const errMessage = err instanceof Error ? err.message : 'An error occurred';
        res.status(500).json({message: errMessage});
    }
};

export const createAccount = async (req: Request, res: Response) => {
    try {
        let replyQueue = 'create.user.account.reply';
        let correlationId = uuidv4();
        let message: MessageLapinou = {
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
        await publishTopic('users', 'create.user.account', message);

        let responses = await receiveResponses(replyQueue, correlationId, 2);
        if (!responses[0].success) {
            throw new Error('Cannot create user account');
        }
        if (!responses[1].success) {
            throw new Error('Cannot create user cart');
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
            throw new Error('Cannot submit cart');
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
                    restorerId: req.body.menu.restorerId,
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
            throw new Error('Cannot remove to cart');
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