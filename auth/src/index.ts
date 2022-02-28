
import mongoose from 'mongoose';
import {StartUpError} from '@jaypeeblogs/common'
import { natsWrapper } from './natswrapper';

import app from './app';



const start = async(port:number)=>{

    
    if(!process.env.JWT){
        throw new StartUpError('JWT env variable not set')
    }
   
    if(!process.env.clusterId){
        throw new StartUpError('clusterId is not set')
    }

    if(!process.env.clientId){
        throw new StartUpError('clientId is not set')
    }

    if(!process.env.url){
        throw new StartUpError('nats url is not set')
    }

    if(!process.env.MongoUrl){
        throw new StartUpError('MongoUrl is not set')
    }
   
    
    
      try{  
        await natsWrapper.connect(
            process.env.clusterId,
            process.env.clientId, 
            process.env.url);

           
            await mongoose.connect(process.env.MongoUrl); 
            console.log('connected to the database')         
        
}catch(err){
        console.error(err)
        process.exit(1)
}

natsWrapper.client.on('close',()=>{
    console.log('closing natsclient connection')
    process.exit()
})



process.on('SIGINT',()=>{
natsWrapper.client.close()
})

process.on('SIGTERM', ()=>{
natsWrapper.client.close()
})


        const PORT = process.env.PORT || port;
        app.listen(PORT, ()=>{
            console.log(`server listening on port: ${PORT}`);
        }) 
    
    
};

start(4000)



