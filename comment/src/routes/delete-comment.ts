import {Router} from 'express';
import {param} from 'express-validator';
import {currentUser, RequireAuth, requestValidation} from '@jaypeeblogs/common'
import mongoose from 'mongoose'

import {deleteComment} from '../controllers/delete-comment';

const deleteCommentRouter = Router();

deleteCommentRouter
.delete('/:commentId',

[param('commentId')
.custom((val:string)=> mongoose.Types.ObjectId.isValid(val))
.withMessage('commentId must be a valid mongodb objectId'),

currentUser,

RequireAuth,

requestValidation,

deleteComment]);

export default deleteCommentRouter;