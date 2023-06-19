import { Request, Response } from 'express';
import {IdentityType} from "../enums/identityType";
import { MessageLapinou, publishTopic, receiveResponses } from '../services/lapinouService';
import { v4 as uuidv4 } from 'uuid';


export const getMyAccount = async (req: Request, res: Response) => {
    try {
            const replyQueue = 'get.restorer.account.reply';
            const correlationId = uuidv4();
            const message: MessageLapinou = {
                success: true,
                content: (req as any).identityId,
                correlationId: correlationId,
                replyTo: replyQueue
            };
            await publishTopic('account', 'get.restorer.account', message);

            const responses = await receiveResponses(replyQueue, correlationId, 1);
            if (responses[0].success === false) {
                return res.status(404).json({message: 'Cannot find restorer account'});
            }
            res.status(200).json(responses[0].content);
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'An error occurred';
            res.status(500).json({message: errMessage});
        }
};

export const getMyCatalog = async (req: Request, res: Response) => {
    try {

    } catch (err) {
        //
    }
};

export const getMenus = async (req: Request, res: Response) => {
    try {
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


export const getAllMyOrders = async (req: Request, res: Response) => {
    try {
        const catalogId = req.params.catalogId;
        const id = req.params.id;
        //
    } catch (err) {
        //
    }
};

export const getMyOrders = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const createAccount = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const createMenu = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const createArticles = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const collectKitty = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
    }
};

export const updateMyAccount = async (req: Request, res: Response) => {
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

export const updateMenu = async (req: Request, res: Response) => {
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

export const deleteMyAccount = async (req: Request, res: Response) => {
    try {
        //
    } catch (err) {
        //
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