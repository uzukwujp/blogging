import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming';
import Post from '../models/post';

export interface PostCreation {
    subject:Subjects,
    data:{
        postId:string
        version:number
    }
};

export class PostCreationListener extends BaseListener<PostCreation> {

    subject:Subjects.postCreation = Subjects.postCreation;

    queuegroup = 'comment-service';

    async onMessage(data:PostCreation['data'], msg:Message) {

        const post = Post.build({_id: data.postId, version: data.version});

        await post.save()
        console.log(`successfully created an saved post:${post._id}`)

        msg.ack();
    }
    

};