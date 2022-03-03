import {StartUpError} from '@jaypeeblogs/common'
import { natsWrapper } from './natsWrapper';
import mongoose from 'mongoose'


import app from './app';
import {CommentCreationListener} from './events/comment-creation-listener'
import {CommentDeleteListener} from './events/comment-delete-listener'
import {CommentUpdateListener} from './events/comment-update-listener'
import {PostCreationListener} from './events/post-creation-listener'
import {PostDeleteListener} from './events/post-delete-listener'
import {PostUpdatedListener} from './events/post-update-listener'
import {UserCreationListener} from './events/user-creation-listener'
import { CommentApprovalListener } from './events/comment-approval-listener';






const start = async (port:number) => {


    if(!process.env.JWT){
        throw new StartUpError('JWT secret is not set')
    }

    if(!process.env.clusterId){
        throw new StartUpError('clusterId is not set')
    }

    if(!process.env.clientId){
        throw new StartUpError('clientId is not set')
    }

    if(!process.env.url){
        throw new StartUpError('Nats url is not set')
    }

    if(!process.env.MongoUrl){
        throw new StartUpError('Mongourl is not set')
    }
    try{

    
        await natsWrapper.connect(
            process.env.clusterId,
            process.env.clientId,
            process.env.url
        );

        natsWrapper.client.on('close',()=>{
            console.log('closing nats connection')
            process.exit()
        })

        process.on('SIGINT',()=>{
            natsWrapper.client.close()
        })

        process.on('SIGTERM', ()=>{
            natsWrapper.client.close()
        })

       
        await mongoose.connect(process.env.MongoUrl)
        
        

        new CommentCreationListener(natsWrapper.client).listen()
        new CommentDeleteListener(natsWrapper.client).listen()
        new CommentUpdateListener(natsWrapper.client).listen()
        new PostCreationListener(natsWrapper.client).listen()
        new PostDeleteListener(natsWrapper.client).listen()
        new PostUpdatedListener(natsWrapper.client).listen()
        new UserCreationListener(natsWrapper.client).listen()
        new CommentApprovalListener(natsWrapper.client).listen()
        
}catch(err){

        console.error(err)
        process.exit(1)
    }

    const PORT = process.env.PORT || port;
    app.listen(PORT, ()=>{
        console.log(`server listening on port: ${PORT}`)})

};

start(5000);