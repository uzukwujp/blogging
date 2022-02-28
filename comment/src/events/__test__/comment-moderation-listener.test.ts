import { CommentModeration, CommentModerationListener } from "../comment-moderation-listener"
import { PostCreationListener, PostCreation } from "../post-creation-listener";
import mongoose from 'mongoose';
import { natsWrapper } from "../../natsWrapper";
import Comment from '../../models/comment'

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

// create a post
// build a comment 
// then call comment update listener with data object whose status is approved

it('updates comments status to approved', async ()=> {
    const {data, msg, listener} = setup()
    await listener.onMessage(data, msg)

    const comment = Comment.build({
        postId: data.postId,
        content: 'Very good',
        author: 'John'
    })

    await comment.save()

    const commentData: CommentModeration['data'] = {
        id: comment._id,
        postId: data.postId,
        content: 'very good',
        author: 'John',
        status: 'approved',
        version: comment.version
    }

    const commentModerationListener = new CommentModerationListener(natsWrapper.client)

    await commentModerationListener.onMessage(commentData, msg)
    const fetchedComment = await Comment.findById({_id: comment._id})
    expect(fetchedComment!.status).toEqual('approved')
});

it('validates that msg.ack was called', async ()=> {
    const {data, msg, listener} = setup()
    await listener.onMessage(data, msg)

    const comment = Comment.build({
        postId: data.postId,
        content: 'Very good',
        author: 'John'
    })

    await comment.save()

    const commentData: CommentModeration['data'] = {
        id: comment._id,
        postId: data.postId,
        content: 'very good',
        author: 'John',
        status: 'approved',
        version: comment.version
    }

    const commentModerationListener = new CommentModerationListener(natsWrapper.client)

    await commentModerationListener.onMessage(commentData, msg)
    expect(msg.ack).toHaveBeenCalled()
});

it('publishes an event', async ()=> {
    const {data, msg, listener} = setup()
    await listener.onMessage(data, msg)

    const comment = Comment.build({
        postId: data.postId,
        content: 'Very good',
        author: 'John'
    })

    await comment.save()

    const commentData: CommentModeration['data'] = {
        id: comment._id,
        postId: data.postId,
        content: 'very good',
        author: 'John',
        status: 'approved',
        version: comment.version
    }

    const commentModerationListener = new CommentModerationListener(natsWrapper.client)

    await commentModerationListener.onMessage(commentData, msg)
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
