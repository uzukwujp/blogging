import {Router} from 'express';
import {body} from 'express-validator';

import {requestValidation} from '@jaypeeblogs/common';
import {signUp} from '../controllers/sign-up';

const signUpRouter = Router();


signUpRouter
.post('/signup', [body('email').isEmail().withMessage('email not valid'),
 body('password').isString().isLength({max: 10, min:6})
 .withMessage('password should be a string greater than 6 characters but less than 10 characters'),
 body('name').isString().withMessage('name should be a string'), 
 requestValidation, signUp ])

 export default signUpRouter;