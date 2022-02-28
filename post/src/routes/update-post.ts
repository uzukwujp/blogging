import {Router} from 'express';
import {body, param} from 'express-validator';
import {currentUser, RequireAuth, requestValidation} from '@jaypeeblogs/common'

import {updatePost} from '../controllers/update-post';
import mongoose from 'mongoose';


const updatePostRouter = Router();

updatePostRouter
.put('/posts/:postId', 
[currentUser, 

RequireAuth, 

body('body')
.isString()
.withMessage('body field should be a string'),

body('topic')
.isString()
.withMessage('topic should be a string'),

param('postId')
.notEmpty()
.custom((val:string)=> mongoose.Types.ObjectId.isValid(val))
.withMessage('postId should be a valid mongoose Id'),

requestValidation, 

updatePost

])

export default updatePostRouter;