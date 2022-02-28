import {Router} from 'express';

import {RequireAuth, currentUser} from '@jaypeeblogs/common';
import {signOut} from '../controllers/sign-out'



const signOutRouter = Router();

signOutRouter
.post('/signout', [currentUser, RequireAuth, signOut]);

export default signOutRouter;