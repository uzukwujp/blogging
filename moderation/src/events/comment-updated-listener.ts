import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming'

import {filterComment} from '../service/filter-comment'
import {CommentModerationPublisher} from './comment-moderation-publisher';

export interface CommentUpdated {
    subject:Subjects,
    data:{
        id:string,
        postId:string,
        content:string
        version:number
        status:string,
        author:string
    }
};

export class CommentUpdatedListener extends BaseListener<CommentUpdated> {
    
    subject:Subjects.commentUpdated = Subjects.commentUpdated;

    queuegroup = 'moderation-service';

    async onMessage(data:CommentUpdated['data'], msg:Message){


        const result = filterComment(data.content);

        if(!result){
            data.status = 'approved';

            await new CommentModerationPublisher(this._client).publish(data)
        
        }
        
        msg.ack();
    }
};