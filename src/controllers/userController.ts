import {Request, Response} from 'express';
import {IdentityType} from "../enums/identityType";
import {v4 as uuidv4} from "uuid";
import {MessageLapinou, publishTopic, receiveResponses} from "../services/lapinouService";


export const getMyAccount = async (req: Request, res: Response) => {
    try {
        // Get /account/user with token to filter
        const account = {
            firstName: 'Killian',
            name: 'LEGENDRE',
            birthday: '2001-10-22',
            phoneNumber: "+33 7 82 04 10 21",
            address: {
                street: '242 rue des Clatz',
                postalCode: 45160,
                city: 'Olivet',
                country: 'France',
            }
        }
        res.status(200).json(account);
    } catch (err) {
        res.status(500).json({message: err});
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
        ]}
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json({message: err});
    }
};

export const getAllCatalogs = async (req: Request, res: Response) => {
    try {
        // Get /catalogs with token
        const catalogs = [{
            id: 1,
            name: "catalog 1",
            description: "Description du catalog 1",
            image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
        },
            {
                id: 2,
                name: "catalog 2",
                description: "Description du catalog 2",
                image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
            },
            {
                id: 3,
                name: "catalog 3",
                description: "Description du catalog 3",
                image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
            },
            {
                id: 4,
                name: "catalog 4",
                description: "Description du catalog 4",
                image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
            },
        ]
        res.status(200).json(catalogs);
    } catch (err) {
        res.status(500).json({message: err});
    }
};

export const getCatalogs = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        // Get /catalogs/:id with token
        const catalog = {
            id: 1,
            name: "Burger Restaurant",
            description: "A restaurant specializing in delicious burgers.",
            image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
            menus: [
                {
                    id: 1,
                    name: "Classic Burger Menu",
                    description: "Enjoy our classic burger with all the fixings.",
                    price: 10,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Classic Burger"},
                        {id: 2, name: "French Fries"},
                        {id: 3, name: "Soft Drink"}
                    ]
                },
                {
                    id: 2,
                    name: "Cheeseburger Menu",
                    description: "Indulge in our cheeseburger with melted cheese and special sauce.",
                    price: 12,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Cheeseburger"},
                        {id: 2, name: "Onion Rings"},
                        {id: 3, name: "Milkshake"}
                    ]
                },
                {
                    id: 3,
                    name: "Vegetarian Burger Menu",
                    description: "A plant-based burger for our vegetarian customers.",
                    price: 10,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Vegetarian Burger"},
                        {id: 2, name: "Sweet Potato Fries"},
                        {id: 3, name: "Iced Tea"}
                    ]
                },
                {
                    id: 4,
                    name: "Chicken Burger Menu",
                    description: "Try our juicy chicken burger with tangy mayo.",
                    price: 11,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Chicken Burger"},
                        {id: 2, name: "Coleslaw"},
                        {id: 3, name: "Lemonade"}
                    ]
                }
            ]
        }
        res.status(200).json(catalog);
    } catch (err) {
        res.status(500).json({message: err});
    }
};

export const getMenus = async (req: Request, res: Response) => {
    try {
        const catalogId = req.params.catalogId;
        const id = req.params.id;
        // Get /catalogs/:id with token
        // Mixer to the menu wanted
        const menu = {
            id: 1,
            name: "Classic Burger Menu",
            description: "Enjoy our classic burger with all the fixings.",
            price: 10,
            image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
            articles: [
                {
                    id: 1,
                    name: "Classic Burger",
                    description: "Our classic burger features a juicy beef patty, fresh lettuce, ripe tomatoes, sliced onions, and pickles, served on a toasted bun.",
                    price: 10,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg"
                },
                {
                    id: 2,
                    name: "French Fries",
                    description: "Golden and crispy French fries seasoned to perfection.",
                    price: 3,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg"
                },
                {
                    id: 3,
                    name: "Soft Drink",
                    description: "Choose from a variety of refreshing soft drinks to accompany your meal.",
                    price: 2,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg"
                }
            ]
        }
        res.status(200).json(menu);
    } catch (err) {
        res.status(500).json({message: err});
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
    }
    catch (err) {
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
    }
    catch (err) {
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
    }
    catch (err) {
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
        res.status(200).json({message: "Account deleted"});
    } catch (err) {
        res.status(500).json({message: err});
    }
};