import express, {Request, Response} from 'express';
import 'express-async-errors'
import { errorHandler, NotFoundError } from '@jaypeeblogs/common'
import cors from 'cors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import createPostRouter from './routes/create-post';
import updatePostRouter from './routes/update-post';
import deletePostRouter from './routes/delete-post';


const app = express();

app.set('trust proxy', false);
app.use(cookieSession({
    secure:false,
    signed:false
}))
app.use(cors())
app.use(json())
app.use('/api', createPostRouter)
app.use('/api', updatePostRouter)
app.use('/api', deletePostRouter);
app.all('*', async (req:Request, res:Response)=>{
    throw new NotFoundError('endpoint is found')
})
app.use(errorHandler)


export default app;