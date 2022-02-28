
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {BadRequestError} from '@jaypeeblogs/common'
import {natsWrapper} from "../natswrapper"

import User from '../model/user';
import {UserCreationPublisher} from '../events/user-creation-publisher'



export const signUp = async (req:Request, res:Response) => {
    const {email,name, password} = req.body;

    const existingUser = await User.findOne({email:email})

    if(existingUser){
        throw new BadRequestError('bad request user already exit');
    }

    const user = User.build({email,name,password});

    await user.save()

    const token = jwt.sign({id:user.id, email:user.email}, process.env.JWT!);
     

    req.session = {token:token};
     
     
     await new UserCreationPublisher(natsWrapper.client).publish(
         {
             id: user.id,
             name: user.name,
             email: user.email,
             version: user.version
         }
     )
     

     res.status(201).send(user);
}

