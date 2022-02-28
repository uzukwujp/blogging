import { PostDeleted, PostDeleteListener } from "../post-delete-listener";
import { natsWrapper } from "../../natsWrapper";
import mongoose from 'mongoose'
import Post from '../../models/post';
import Author from '../../models/author'

const setUp = async () => {
    const authorId = new mongoose.Types.ObjectId().toHexString()
    const data: PostDeleted['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0
    };
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    const author = Author.build({
        _id: authorId,
        name: 'John'
    })

    await author.save()

    const listener = new PostDeleteListener(natsWrapper.client)

    return { msg, data, authorId, listener}
};

it('deletes a post when onMessage is called on PostDeleteListener',async ()=> {

    const {data, msg, authorId, listener} = await setUp()
    const author = await Author.findById({_id: authorId})
    if(!author){
        throw new Error('author not found')
    }

    const post = Post.build({
        _id: data.id,
        body:'Very lucrative',
        topic: 'Technical Writting',
        author: author
    })

    await post.save()

    await listener.onMessage(data, msg)
    const deletedPost = await Post.findById({_id: data.id})
    expect(deletedPost).toEqual(null)
});

it('validates that msg.ack was called atleast once', async ()=>{
    const {data, msg, authorId, listener} = await setUp()
    const author = await Author.findById({_id: authorId})
    if(!author){
        throw new Error('author not found')
    }

    const post = Post.build({
        _id: data.id,
        body:'Very lucrative',
        topic: 'Technical Writting',
        author: author
    })

    await post.save()

    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
});