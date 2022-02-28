import {Router} from 'express';
import {body} from 'express-validator';
import {currentUser, RequireAuth, requestValidation} from '@jaypeeblogs/common'

import {createPost} from '../controllers/create-post';


const createPostRouter = Router();

createPostRouter
.post('/posts', [currentUser, RequireAuth, body('body').isString().withMessage('body field should be a string'),
 body('topic').isString().withMessage('topic should be a string'),
requestValidation, createPost])

export default createPostRouter;