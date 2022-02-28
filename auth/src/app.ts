import express,{Request, Response} from 'express';
import "express-async-errors";
import {json} from 'body-parser';
import cors from 'cors';
import cookieSession from 'cookie-session';


import {errorHandler, NotFoundError} from '@jaypeeblogs/common';
import signUpRouter from './routes/sign-up';
import signInRouter from './routes/sign-in';
import signOutRouter from './routes/sign-out';
import currentUserRouter from './routes/current-user';

const app = express()

app.set('trust proxy', false);
app.use(cors())
app.use(json())
app.use(cookieSession({
    secure: false,
    signed:false
}))
app.use('/api/users', signUpRouter)
app.use('/api/users', signInRouter)
app.use('/api/users', signOutRouter)
app.use('/api/users', currentUserRouter)
app.all('*', async (req:Request, res:Response)=> {
    throw new NotFoundError('endpoint not found')
})
app.use(errorHandler);



export default app;