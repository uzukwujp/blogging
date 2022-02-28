import {param} from 'express-validator'
import {Router} from 'express';
import {currentUser, requestValidation, RequireAuth} from '@jaypeeblogs/common'
import mongoose from 'mongoose'

import {getOneBlog} from '../controller/get-one-blog'

const getOneBlogRouter = Router();


getOneBlogRouter
.get('/blogs/:postId',
[currentUser,

RequireAuth,

param('postId')
.custom((val: string) => mongoose.Types.ObjectId.isValid(val))
.withMessage('postId path varaiable is not a valid mongoose objectId'),

requestValidation,

getOneBlog]);

export default getOneBlogRouter;