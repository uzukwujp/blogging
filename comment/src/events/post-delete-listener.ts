import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming';

import Post from '../models/post';

export interface PostDeleted {
    subject:Subjects,
    data:{id:string,version:number}
}

export class PostDeletedListener extends BaseListener<PostDeleted>{
    
    subject:Subjects.postDeleted = Subjects.postDeleted;

    queuegroup = 'comment-service';

    async onMessage(data:PostDeleted['data'], msg:Message) {

       const deletedPost =  await Post.deleteOne({_id: data.id})
       
       console.log(`post:${data.id}deleted successfully`)
       
        msg.ack()
    }
};