import {Request, Response} from 'express';
import {IdentityType} from "../enums/identityType";


export const getMyAccount = async (req: Request, res: Response) => {
    try {
        // Get /account/user with token to filter
        const account = {
            firstName: 'Killian',
            name: 'LEGENDRE',
            birthday: '22/10/2001',
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
        //
        res.status(400);
    }
};

export const getMyCart = async (req: Request, res: Response) => {
    try {
        // Get /cart with token to filter
        const cart = [
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
            }
        ]
        res.status(200).json(cart);
    } catch (err) {
        //
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
        //
    }
};

export const getCatalogs = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        // Get /catalogs/:id with token
        const catalog = {
            id: 1,
            name: "catalog 1",
            description: "Description du catalog 1",
            image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",

            menus: [
                {
                    id: 1,
                    name: "Menu 1",
                    description: "Description du menu 1",
                    price: 20,
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
                    price: 20,
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
                    price: 20,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Article 1"},
                        {id: 2, name: "Article 2"},
                        {id: 3, name: "Article 3"},
                    ],
                },
                {
                    id: 4,
                    name: "Menu 4",
                    description: "Description du restaurant 4",
                    price: 20,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                    articles: [
                        {id: 1, name: "Article 1"},
                        {id: 2, name: "Article 2"},
                        {id: 3, name: "Article 3"},
                    ],
                },
            ]
        }
        res.status(200).json(catalog);
    } catch (err) {
        //
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
            name: "Menu 1",
            description: "Description du menu 1",
            price: 20,
            image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
            articles: [
                {
                    id: 1,
                    name: "Article 1",
                    description: "Description de l'article 1",
                    price: 10,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                },
                {
                    id: 2,
                    name: "Article 2",
                    description: "Description de l'article 2",
                    price: 10,
                    image: "https://dkrn4sk0rn31v.cloudfront.net/uploads/2022/10/o-que-e-e-como-comecar-com-golang.jpg",
                },
            ]
        }
        res.status(200).json(menu);
    } catch (err) {
        //
    }
};

export const createAccount = async (req: Request, res: Response) => {
    try {
        // Create an account using the token and body infos
    } catch (err) {
        //
    }
};

export const createOrder = async (req: Request, res: Response) => {
    try {
        // Create an order using the token and body infos
    } catch (err) {
        //
    }
};

export const updateMyAccount = async (req: Request, res: Response) => {
    try {
        // Update an account using the token
    } catch (err) {
        //
    }
};

export const updateMyCart = async (req: Request, res: Response) => {
    try {
        // Update a cart using the token
    } catch (err) {
        //
    }
};

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        // delete an account using the token
    } catch (err) {
        //
    }
};