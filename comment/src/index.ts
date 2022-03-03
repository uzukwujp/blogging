
import mongoose from 'mongoose';
import {StartUpError} from '@jaypeeblogs/common'
import { natsWrapper } from './natsWrapper';

import app from './app';
import {PostCreationListener} from './events/post-creation-listener';
import {PostDeletedListener} from './events/post-delete-listener'
import { CommentModerationListener } from './events/comment-moderation-listener';


const start = async (port:number) => {
  
    if(!process.env.JWT){
        throw new StartUpError('JWT secret is not set')
    }

    if(!process.env.clusterId){
      throw new StartUpError('Nats clusterId is not set')
  }

  if(!process.env.clientId){
    throw new StartUpError('Nats clientId is not set')
 }

 if(!process.env.url){
  throw new StartUpError('Nats url is not set')
 }

if(!process.env.MongoUrl){
  throw new StartUpError('MongoUrl is not set')
}

  
try{
    await natsWrapper.connect(
      process.env.clusterId,
      process.env.clientId,
      process.env.url
    )

    natsWrapper.client.on('close', ()=>{
      console.log('Nats connection closed');
      process.exit()
    });

    process.on('SIGINT',()=>{
      natsWrapper.client.close()
    });

    process.on('SIGTERM', ()=>{
      natsWrapper.client.close()
    })
    
    
    await mongoose.connect(process.env.MongoUrl)
    
   

    new PostCreationListener(natsWrapper.client).listen();
    new PostDeletedListener(natsWrapper.client).listen();
    new CommentModerationListener(natsWrapper.client).listen()

}catch(err){
    console.error(err)
    process.exit(1)
  }
  const PORT = process.env.PORT || port
  app.listen(PORT, ()=>{console.log(`server listening on port:${PORT}`)})
};

start(4000);




