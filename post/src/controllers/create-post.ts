import {Request, Response} from 'express';
import {natsWrapper} from "../natswrapper"

import Post from '../model/post';
import {PostCreationPublisher} from '../events/post-creation-publisher';


// user must be authenticated to create a post
export const createPost = async (req:Request, res:Response) => {
    
    const {topic,body} = req.body;

    const post = Post.build({topic:topic, body:body, author: req.currentUser!.id});
    
    await post.save();

    await new PostCreationPublisher(natsWrapper.client).publish(
        {
            postId: post._id,
            author: post.author,
            body: post.body,
            topic: post.topic,
            version: post.version
        }
    );

    res.status(201).send(post);
};