import express,{Request, Response} from "express";
import 'express-async-errors';
import {errorHandler, NotFoundError} from '@jaypeeblogs/common'
import cors from 'cors';
import {json} from 'body-parser';
import cookieSession from "cookie-session";

import createCommentRouter from "./routes/create-comment";
import updateCommentRouter from "./routes/update-comment";
import deleteCommentRouter from "./routes/delete-comment";

const app = express();
app.set('trust proxy', false);
app.use(cors())
app.use(json());
app.use(cookieSession({
    secure:false,
    signed:false
}))
app.use('/api/comments', createCommentRouter)
app.use('/api/comments', updateCommentRouter)
app.use('/api/comments', deleteCommentRouter)
app.all('*', async (req:Request, res:Response)=>{
    throw new NotFoundError('endpoint not found')
})

app.use(errorHandler);

export default app;