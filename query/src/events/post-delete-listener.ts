import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming'

import Post from '../models/post'
import Blog from '../models/blog'


export interface PostDeleted {
    subject:Subjects,
    data:{
        id:string,
        version:number
    }
};


export class PostDeleteListener extends BaseListener<PostDeleted> {

    subject:Subjects.postDeleted = Subjects.postDeleted

    queuegroup = 'query-service';

    async onMessage(data:PostDeleted['data'], msg:Message){

        await Post.deleteOne({_id: data.id});

        await Blog.deleteOne({_id: data.id})

        msg.ack()
    }

};
