import {Request, Response} from 'express';
import {NotFoundError, NotAuthorisedError} from '@jaypeeblogs/common';
import { natsWrapper } from '../natsWrapper';

import Comment from '../models/comment';
import {CommentUpdatedPublisher} from '../events/comment-update-publisher';

export const updateComment = async (req:Request, res:Response) => {
    
    const {commentId} = req.params;
    const {content} = req.body;

    const comment = await Comment.findById({_id:commentId});

    if(!comment){
        throw new NotFoundError('comment not found');
    }

    if(comment.author !== req.currentUser!.id){
        throw new NotAuthorisedError('forbidden, not authorised');
    }

    comment.set('content', content);
    comment.set('status','pending');

    await comment.save()

    await new CommentUpdatedPublisher(natsWrapper.client).publish(
        {
            id: comment._id,
            postId: comment.postId,
            content: comment.content,
            version: comment.version,
            status: comment.status
        }
    );



    res.send(comment)
};