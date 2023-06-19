import { Request, Response } from 'express';
import {IdentityType} from "../enums/identityType";


export const getMyAccount = async (req: Request, res: Response) => {
    try {

        switch ((req as any).identityType) {
            case IdentityType.USER:
                // Get /account/user with token to filter
                const account= {
                    firstName: 'Killian',
                    name: 'LEGENDRE',
                    birthday: 22/10/2001,
                    phoneNumber: "+33 7 82 04 10 21",
                    address: {
                        street: '242 rue des Clatz',
                        postalCode: 45160,
                        city: 'Olivet',
                        country: 'France',
                    }
                }
                res.status(200).json(account);
                break;
            case IdentityType.RESTORER:
                // Get /account/restorer with token to filter
                res.status(400);
                break;
            case IdentityType.DELIVERYMAN:
                // Get /account/deliveryman to filter
                res.status(400);
                break;
            default:
                res.status(400);
                break;
        }
        res.status(400);
    } catch (err) {
        //
    }
};

export const getAllMyCommands = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        //
    }
};

export const getMyCommands = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        //
    } catch (err) {
        //
    }
};
export const getMyCatalog = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};


export const getMenus = async (req: Request, res: Response) => {
    try {
        const catalogId = req.params.catalogId;
        const id = req.params.id;
        //
    } catch (err) {
        //
    }
};

export const getArticles = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const updateMyCatalog = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const updateMenus = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const updateArticles = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};