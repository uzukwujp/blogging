import {natsWrapper} from '../../natsWrapper'
import { PostCreationListener } from '../post-creation-listener'
import {PostCreation} from  '../post-creation-listener'
import mongoose from 'mongoose'
import {Message} from 'node-nats-streaming'
import Post from '../../models/post'


const setup = () => {

    const data:PostCreation['data'] = {
        postId: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()

    }

    const listener = new PostCreationListener(natsWrapper.client)

    return {data, msg, listener}
};

it('creates a post when onMessage function on postCreationListener is called', async ()=> {

    const {data,msg,listener} = setup()

    await listener.onMessage(data,msg)

    const post = await Post.findById({_id: data.postId})
    expect(post).toBeDefined()
    expect(post!.id).toEqual(data.postId) 
}); 

it('confirms msg.ack was called', async ()=>{
    const {data,msg,listener} = setup()

    await listener.onMessage(data,msg)

    expect(msg.ack).toHaveBeenCalled()
});






