import { CommentCreation, CommentCreationListener } from "../comment-creation-listener"
import mongoose from 'mongoose'
import { natsWrapper } from "../../natsWrapper"
import {Message} from 'node-nats-streaming'

const setUp = ()=>{

    const data: CommentCreation['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        postId: new mongoose.Types.ObjectId().toHexString(),
        content: 'very good',
        author: 'John',
        status: 'pending',
        version: 0
    }

    const listener = new CommentCreationListener(natsWrapper.client)

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }



    return {data, msg, listener}
};

it('changes event data.status to approved if content do not contain fowl language', async ()=>{
    const {data,msg, listener} = setUp()

    await listener.onMessage(data,msg)
    expect(data.status).toEqual('approved')
});

it('leaves data.status unchanged if content contains a fowl language', async ()=> {

    let {data,msg,listener} = setUp()
    
    data.content = 'fuck up';

    await listener.onMessage(data, msg)
    expect(data.status).toEqual('pending')
});

it('publishes an event', async ()=> {
    const {data,msg, listener} = setUp()

    await listener.onMessage(data,msg)
    
    expect(data.status).toEqual('approved')
    expect(natsWrapper.client.publish).toHaveBeenCalled()
});