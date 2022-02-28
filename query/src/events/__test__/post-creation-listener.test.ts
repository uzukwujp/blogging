import { PostCreation, PostCreationListener } from "../post-creation-listener";
import { natsWrapper } from "../../natsWrapper";
import mongoose from 'mongoose'
import Author from "../../models/author";
import Post from '../../models/post'
import Blog from '../../models/blog'

const authorId = new mongoose.Types.ObjectId().toHexString()
const setUp = () => {
    const data: PostCreation['data'] = {
        postId: new mongoose.Types.ObjectId().toHexString(),
        topic: 'Technical Writting',
        body: 'Very Lucrative',
        author: authorId,
        version: 0
    };
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    const listener = new PostCreationListener(natsWrapper.client)

    return { msg, data, listener}
};

it('throws an exception if author do not exist', async ()=> {

    const {data,msg,listener} = setUp()

try{
    await listener.onMessage(data,msg)
}catch(err){
    return
}

throw new Error('should not get to here!!!!')

});


it('creates a post and blog object when onMassage function on PostCreationListener is called', async ()=>{
    
    const author = Author.build({
        _id: authorId,
        name: 'John'
    })
    await author.save()

    const {msg, data, listener} = setUp()
    await listener.onMessage(data, msg)
    const post = await Post.findById({_id: data.postId})
    const blog = await Blog.findById({_id: data.postId})
    expect(post).toBeDefined()
    expect(blog).toBeDefined()
    expect(post!.topic).toEqual('Technical Writting')
    expect(blog!.topic).toEqual(post!.topic)
})

it('validates that msk.ack on the PostCreationListener was called', async ()=> {
    const author = Author.build({
        _id: authorId,
        name: 'John'
    })
    await author.save()

    const {msg, data, listener} = setUp()
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})




