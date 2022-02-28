import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming'

import Post from '../models/post'
import Blog from '../models/blog'


export interface PostUpdated {
    subject:Subjects,
    data:{
    id:string,
    body:string,
    topic:string
    version: number
   }
};


export class PostUpdatedListener extends BaseListener<PostUpdated> {

    subject:Subjects.postUpdated = Subjects.postUpdated;

    queuegroup = 'query-service'

    async onMessage(data:PostUpdated['data'], msg:Message){

        const post = await Post.findOne({_id: data.id, version: data.version-1});

        if (!post){
            return 
        }
        
        const blog = await Blog.findById({_id: data.id})

        if(post && blog){
            if(data.body){
            post.set('body', data.body);
            }
            if(data.topic){
            post.set('topic', data.topic)
            }
            await post.save();
            
            if(data.body){
            blog.set('body', data.body)
            }
            if(data.topic){
            blog.set('topic', data.topic)
            }

            await blog.save()
        }
        console.log(`post:${data.id} updated successfully`)

        msg.ack()

    }
};