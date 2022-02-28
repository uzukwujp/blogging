import mongoose from 'mongoose';
import app from './app';
import {StartUpError} from '@jaypeeblogs/common';
import { natsWrapper } from './natswrapper';


const start = async(port:number) => {


    if(!process.env.JWT){
        throw new StartUpError('JWT secret not set');
    }

    if(!process.env.clusterId){
        throw new StartUpError('clusterId is not set');
    }

    if(!process.env.clientId){
        throw new StartUpError('clientId is not set');
    }

    if(!process.env.url){
        throw new StartUpError('Nats url not set');
    }

    if(!process.env.MongoUrl){
        throw new StartUpError('MongoUrl not set');
    }
    try{
    
    
        
        await natsWrapper.connect(
            process.env.clusterId,
            process.env.clientId,
            process.env.url
        );

        natsWrapper.client.on('close', ()=>{
            console.log('nats connection closed')
            process.exit()
        })

        process.on('SIGINT',()=>{
            natsWrapper.client.close()
        })

        process.on('SIGTERM', ()=>{
            natsWrapper.client.close()
        })
       
        
        await mongoose.connect(process.env.MongoUrl);
       

}catch(err){
        console.error(err)
        process.exit(1)
    }
    const PORT = process.env.PORT || port;
    app.listen(PORT, ()=>{console.log(`server connected to ${PORT}`)});
};

start(5000)