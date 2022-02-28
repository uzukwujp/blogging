import Author from '../../models/author'
import Blog from '../../models/blog'
import mongoose from 'mongoose';
import { CommentCreation, CommentCreationListener } from '../comment-creation-listener';
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

it('successfuly adds a comment to the blog post', async ()=>{

    const {data, msg, author, blog, listener} = await setUp()

    await listener.onMessage(data, msg)
    const fetchedBlog = await Blog.findById({_id: blog._id}).populate('comments')
    expect(fetchedBlog!.comments.length).toEqual(1)
    expect(fetchedBlog!.comments[0].content).toEqual('This is awesome')

});

it('validates that msg.ack is called', async ()=> {

    const {data, msg, author, blog, listener} = await setUp()

    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()

})