import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming'

import Comment from '../models/comment';
import Blog from '../models/blog'

export interface CommentApproval {
    subject:Subjects,
    data:{
        id:string,
        postId:string,
        content:string
        version:number,
        status:string
    }
};


export class CommentApprovalListener extends BaseListener < CommentApproval> {

    subject:Subjects.commentApproval = Subjects.commentApproval

    queuegroup = 'query-service'

    async onMessage(data:CommentApproval['data'],msg:Message){

        const comment = await Comment.findOne(
            {
                _id: data.id,
                version : data.version-1
            }
        );

        if(!comment){
            
            return 
        }

        comment.set('status', data.status);
        const savedComment = await comment.save()

        const blog = await Blog.findById(
            {
                _id: data.postId
            }
        ).populate('comments')

        if(!blog){
            
            return 
        }

        const index = blog.comments.findIndex((comment)=> comment._id = data.id);
        
        // removing the old comment
        blog.comments.splice(index, 1);

        // creatng and adding the updated comment
        blog.comments.push(savedComment._id)
        
        await blog.save()

        msg.ack()  
    }
}