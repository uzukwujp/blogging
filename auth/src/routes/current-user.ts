import {Router} from 'express';
import { currentUser } from '@jaypeeblogs/common';

import {currentUserHandler} from '../controllers/current-user';


const currentUserRouter = Router();

currentUserRouter
.get('/currentuser', currentUser, currentUserHandler);

export default currentUserRouter;