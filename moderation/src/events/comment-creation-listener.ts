import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming';

import {filterComment} from '../service/filter-comment';
import { CommentModerationPublisher } from '../events/comment-moderation-publisher';





export interface CommentCreation {
    subject:Subjects,
    data:{
        id:string,
        postId:string,
        content:string,
        author:string,
        status:string,
        version:number
    }
};

export class CommentCreationListener extends BaseListener<CommentCreation> {
    
    subject:Subjects.commentCreation = Subjects.commentCreation;

    queuegroup = 'moderation-service'

    async onMessage(data:CommentCreation['data'], msg:Message){

        const result = filterComment(data.content);

        if(!result){
            // publish commentModeration with comment status changed to approved
            data.status = 'approved';

            await new CommentModerationPublisher(this._client).publish(data);
            
        }

        msg.ack()
    } 

    
}