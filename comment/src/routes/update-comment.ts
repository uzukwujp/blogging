import {Router} from 'express';
import {body,param} from 'express-validator';
import {currentUser,RequireAuth, requestValidation} from '@jaypeeblogs/common'

import {updateComment} from '../controllers/update-comment'
import mongoose from 'mongoose';

const updateCommentRouter = Router();

updateCommentRouter
.put('/:commentId',

[body('content')
.not()
.isEmpty()
.isString()
.withMessage('content is not a valid string'),

param('commentId')
.custom((val:string)=> mongoose.Types.ObjectId.isValid(val))
.withMessage('commentId is not a valid string'),

currentUser,

RequireAuth,

requestValidation,

updateComment]);

export default updateCommentRouter;