import {Request, Response} from 'express';
import {NotFoundError, NotAuthorisedError} from '@jaypeeblogs/common'
import { natsWrapper } from '../natswrapper';

import Post from '../model/post';
import {PostDeletedPublisher} from '../events/post-deleted-publisher'



export const deletePost = async (req:Request, res:Response) => {
    const {postId } = req.params;

    const post = await Post.findById({_id:postId});

    if (!post){
        throw new NotFoundError(' post not found');
    }
    if(post.author !== req.currentUser!.id){
        throw new NotAuthorisedError('forbidden,not authorised to delete post');
    }

    const PostDeleted = await Post.deleteOne({_id:postId});
    
    await new PostDeletedPublisher(natsWrapper.client).publish(
        {
            id: postId,
            version: post.version
        }
    )
      
  
    res.send(PostDeleted)

};