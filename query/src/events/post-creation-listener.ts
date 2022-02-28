import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming';

import Post from '../models/post';
import Author from '../models/author';
import Blog from '../models/blog';

export interface PostCreation {
    subject:Subjects,
    data:{postId:string,
         topic:string,
        body:string,
        author:string
        version: number
    };
};


export class PostCreationListener extends BaseListener<PostCreation> {

    subject:Subjects.postCreation = Subjects.postCreation;

    queuegroup = 'query-service';

    async onMessage(data:PostCreation['data'], msg:Message){

        const author = await Author.findById({_id: data.author});

        if(!author){
            return 
        };

        const post = Post.build(

            {
                _id: data.postId,
                topic: data.topic,
                body: data.body,
                author: author
            }
        );

        await post.save()

        const blog = Blog.build(
            {
                _id: post._id,
                topic: post.topic,
                body: post.body,
                author: post.author
            }
        );

        await blog.save()
        console.log(`saved post: ${post._id} successfully`)

        msg.ack();

    }
};