import Author from '../../models/author'
import Blog from '../../models/blog'
import mongoose from 'mongoose';
import { CommentCreation, CommentCreationListener } from '../comment-creation-listener';
import { CommentUpdated, CommentUpdateListener } from '../comment-update-listener';
import { natsWrapper } from '../../natsWrapper';
import { Message } from 'node-nats-streaming';



const setUp = async () => {
    const authorId = new mongoose.Types.ObjectId().toHexString()

    const author = Author.build({
        _id: authorId,
        name: 'John'
    })

    await author.save()

    let data: CommentCreation['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        postId: new mongoose.Types.ObjectId().toHexString(),
        content: 'This is awesome',
        author: author._id,
        status: 'pending',
        version: 0
    }  

    const blog = Blog.build({
        _id: data!.postId,
        topic: 'Tech',
        body: 'very lucrative',
        author: author._id
    })

    await blog.save()

    //@ts-ignore
    const msg: Message =  {
        ack: jest.fn()
    }


    const listener = new CommentCreationListener(natsWrapper.client)

    return {msg, data, listener, authorId, author, blog}   

};

it('successfully updates a comment', async ()=> {
    const {msg, listener, blog, data} = await setUp()
    await listener.onMessage(data, msg)
    const fetchedBlog = await Blog.findById({_id: blog._id}).populate('comments')

    const commentData: CommentUpdated['data'] =  {
        id: fetchedBlog!.comments[0]._id,
        postId: blog._id,
        content: 'Very good',
        version: 1,
        status: 'pending'
    }

    const commentDeleteListener = new CommentUpdateListener(natsWrapper.client)
    await commentDeleteListener.onMessage(commentData, msg)
    const blogSecondInstance = await Blog.findById({_id: blog._id}).populate('comments')
    expect(blogSecondInstance!.comments[0].content).toEqual('Very good')
});

it('validates that msg.ack was called atleast once', async ()=>{

    const {msg, listener, blog, data} = await setUp()
    await listener.onMessage(data, msg)
    const fetchedBlog = await Blog.findById({_id: blog._id}).populate('comments')

    const commentData: CommentUpdated['data'] =  {
        id: fetchedBlog!.comments[0]._id,
        postId: blog._id,
        content: 'Very good',
        version: 1,
        status: 'pending'
    }

    const commentDeleteListener = new CommentUpdateListener(natsWrapper.client)
    await commentDeleteListener.onMessage(commentData, msg)
    expect(msg.ack).toHaveBeenCalled()
});
