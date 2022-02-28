import {PostUpdated, PostUpdatedListener} from '../post-update-listener'
import mongoose from 'mongoose'
import Author from '../../models/author'
import { natsWrapper } from '../../natsWrapper';
import Post from '../../models/post'
import Blog from '../../models/blog'


const setUp = async () => {
    const authorId = new mongoose.Types.ObjectId().toHexString()
    const data: PostUpdated['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        topic: 'Tech',
        body: 'the new oil',
        version: 1
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

    const listener = new PostUpdatedListener(natsWrapper.client)

    return { msg, data, authorId, listener}
};

it('validates that msg.ack is not called when post is not found', async ()=> {
    const {msg, data, listener} = await setUp()
    await listener.onMessage(data,msg)
    const updatedPost = await Post.findById({_id: data.id})
    expect(updatedPost).toEqual(null)
    expect(msg.ack).toHaveBeenCalled()
});

it('updates a post successfully when onMessage function PostUpdatedListener is called', async ()=>{
    const {msg, authorId, data, listener} = await setUp()
    const author = await Author.findById({_id: authorId})
    if(!author){
        throw new Error('author not found')
    }

    const newPost = Post.build({
        _id: data.id,
        topic: 'tech',
        body: 'the new oil',
        author: author
    })

    await newPost.save()
    await listener.onMessage(data, msg)
    const postInstance = await Post.findById({_id: data.id})
    expect(postInstance!.topic).toEqual('tech')
});

it('validates that msg.ack was called', async ()=>{
    const {msg, authorId, data, listener} = await setUp()
    const author = await Author.findById({_id: authorId})
    if(!author){
        throw new Error('author not found')
    }

    const newPost = Post.build({
        _id: data.id,
        topic: 'tech',
        body: 'the new oil',
        author: author
    })

    await newPost.save()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
});


