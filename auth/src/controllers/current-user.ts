import {Request, Response} from 'express';

export const currentUserHandler = async (req:Request, res:Response) => {

 res.send({currentUser: req.currentUser || null})
};