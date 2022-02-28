import {Router} from 'express';
import {param} from 'express-validator';
import {currentUser, RequireAuth, requestValidation} from '@jaypeeblogs/common'

import {deletePost} from '../controllers/delete-post';
import mongoose from 'mongoose';


const deletePostRouter = Router();

deletePostRouter
.delete('/posts/:postId',
 [currentUser,
 RequireAuth, 
 param('postId')
.custom((val:string)=> mongoose.Types.ObjectId.isValid(val))
.withMessage('postId should be a valid mongoose objectId'),
requestValidation,

deletePost])

export default deletePostRouter;