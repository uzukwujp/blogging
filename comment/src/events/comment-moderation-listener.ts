import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming'

import Comment from '../models/comment';
import {CommentApprovalPublisher} from './comment-approval-publisher'

export interface CommentModeration {
    subject:Subjects,
    data:{
        id:string,
        postId:string,
        content:string,
        author:string,
        status:string
        version:number
    }
};


export class CommentModerationListener extends BaseListener<CommentModeration>{
    subject:Subjects.commentModeration = Subjects.commentModeration;

    queuegroup = 'comment-service';

    async onMessage(data:CommentModeration['data'], msg:Message) {

        const comment = await Comment.findOne({_id:data.id});

        
        if(!comment){
        
            return 
        }

        comment.set('status', data.status);

        await comment.save();

        await new CommentApprovalPublisher(this._client).publish(
            {
                id: comment.id,
                postId: comment.postId,
                content: comment.content,
                version: comment.version,
                status: comment.status
            }
        );

        msg.ack();


    }
};