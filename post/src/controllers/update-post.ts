import {Request, Response} from 'express';
import Post from '../model/post';
import {NotFoundError,NotAuthorisedError} from '@jaypeeblogs/common';
import { natsWrapper } from '../natswrapper';
import {PostUpdatedPublisher} from '../events/post-updated-publisher';


 export const updatePost = async (req:Request, res:Response) => {
    const {topic, body} = req.body;
    const {postId} = req.params;

    const post = await Post.findById({_id:postId});
    
    
    if(!post){
        throw new NotFoundError(' post not found');
    }

    if(post.author !== req.currentUser!.id){
        throw new NotAuthorisedError('forbidden, not authorised to update post')
    }

    if (topic){
        post.set('topic', topic);
    }
    
    if(body){
    post.set('body', body);
    }
    
    await post.save()
  
    await new PostUpdatedPublisher(natsWrapper.client).publish(
        {
            id: post._id,
            topic: post.topic,
            body: post.body,
            version: post.version
        }
    );

    res.send(post)
};