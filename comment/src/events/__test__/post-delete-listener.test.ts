import { PostDeleted } from "../post-delete-listener";
import {Message} from 'node-nats-streaming'
import mongoose from 'mongoose'
import { PostDeletedListener } from "../post-delete-listener";
import Post from '../../models/post'
import { natsWrapper } from "../../natsWrapper";

const setUp = async () => {
    const data:PostDeleted['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version:0
    };
//@ts-ignore
    const msg: Message = {
        ack : jest.fn()
    };

    const listener = new PostDeletedListener(natsWrapper.client)

    const post = Post.build({
        _id: data.id,
        version: 0
    })

    await post.save()

    return {data, msg, post, listener}  
};

it('deletes a post when onMessage function on PostDeleteListener is called', async ()=> {
    const {data, msg, post, listener} = await setUp()

    await listener.onMessage(data,msg)
    const deletedPost = await Post.findById({_id: data.id})
    console.log(deletedPost)
    expect(deletedPost).toEqual(null)
});

it('validates that the msg.ack was called', async ()=> {
    const {data,msg,post, listener} = await setUp()

    await listener.onMessage(data,msg)
    expect(msg.ack).toHaveBeenCalled()
})