import {Router} from 'express';
import {currentUser,RequireAuth} from '@jaypeeblogs/common';

import {getAllBlogs} from '../controller/get-all-blogs'


const getAllBlogRouter = Router();


getAllBlogRouter
.get('/blogs',
[currentUser,

RequireAuth,

getAllBlogs]);


export default getAllBlogRouter;