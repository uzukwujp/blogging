
import {Request, Response} from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {NotFoundError, BadRequestError} from '@jaypeeblogs/common'

import User from '../model/user';

export const signIn = async (req:Request, res:Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});

    if(!existingUser){
        throw new NotFoundError('account not found');
    }

    const validUser = await bcrypt.compare(password, existingUser.password);
    
    if(!validUser){
        throw new BadRequestError ('invalid credential')
    }

    const token = jwt.sign({id:existingUser.id, email:existingUser.email}, process.env.JWT!);

    req.session = {token:token};

    res.send(existingUser);
};