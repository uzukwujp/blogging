import {StartUpError} from '@jaypeeblogs/common';
import { natsWrapper } from './natsWrapper';

import {CommentCreationListener} from './events/comment-creation-listener';
import {CommentUpdatedListener} from './events/comment-updated-listener'

const start = async () => {


    if(!process.env.clusterId){
        throw new StartUpError('nats clusterId is not set')
    }

    if(!process.env.clientId){
        throw new StartUpError('nats clientId is not set')
    }

    if(!process.env.url){
        throw new StartUpError('nats url is not set')
    }
    try{

    

        await natsWrapper.connect (
            process.env.clusterId,
            process.env.clientId,
            process.env.url
        )

        natsWrapper.client.on('close', ()=>{
            console.log('connection to nats client closed')
            process.exit()
        })

        process.on('SIGINT',()=>{
            natsWrapper.client.close()
        })

        process.on('SIGTERM', ()=>{
            natsWrapper.client.close()
        })

        new CommentCreationListener(natsWrapper.client).listen()
        new CommentUpdatedListener(natsWrapper.client).listen();

}catch(err){
        
        console.error(err)
        process.exit(1)
}
};

start();