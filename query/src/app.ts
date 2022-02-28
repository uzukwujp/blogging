import express,{Request,Response} from 'express';
import {json} from 'body-parser';
import {errorHandler, NotFoundError} from '@jaypeeblogs/common';
import cookieSession from 'cookie-session';


import getAllBlogRouter from './routes/get-all-blog';
import getOneBlogRouter from './routes/get-one-blog';

const app = express();


app.set('trust proxy', false)

app.use(json())

app.use(cookieSession({
    signed:false,
    secure:false
}))

app.use('/api', getOneBlogRouter)
app.use('/api', getAllBlogRouter)
app.all('*', async (req:Request, res:Response)=>{
    throw new NotFoundError('endpoint do not exit')

})
app.use(errorHandler)



export default app;