import {Router} from 'express';
import {body} from 'express-validator';

import {requestValidation} from '@jaypeeblogs/common'
import {signIn} from '../controllers/sign-in'

const signInRouter = Router();

signInRouter
.post('/signin', [body('email').isEmail().withMessage('email not valid'),
body('password').isString().isLength({max: 10, min:6})
.withMessage('password should be a string greater than 6 characters but less than 10 characters'),
requestValidation, signIn]);

export default signInRouter;