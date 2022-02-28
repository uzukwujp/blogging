import {Router} from 'express';
import {currentUser, RequireAuth, requestValidation} from '@jaypeeblogs/common'
import {body,param} from 'express-validator';
import mongoose from 'mongoose'

import {createComment} from '../controllers/create-comment'

const createCommentRouter = Router();

createCommentRouter
.post('/:postId',

[body('content')
.isString()
.withMessage('content should be a string'),

param('postId')
.custom((val:string)=> mongoose.Types.ObjectId.isValid(val))
.withMessage('postId must be a valid mongodb objectId'),

currentUser,

RequireAuth,

requestValidation,

createComment]);

export default createCommentRouter;

