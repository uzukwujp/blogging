import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming'

import Comment from '../models/comment';
import Blog from '../models/blog'

export interface CommentUpdated {
    subject:Subjects,
    data:{
        id:string,
        postId:string,
        content:string
        version:number,
        status:string
    }
};


export class CommentUpdateListener extends BaseListener < CommentUpdated > {

    subject:Subjects.commentUpdated = Subjects.commentUpdated

    queuegroup = 'query-service'

    async onMessage(data:CommentUpdated['data'],msg:Message){

        const comment = await Comment.findOne(
            {
                _id: data.id,
                version : data.version-1
            }
        );

        if(!comment){
            
            return 
        }

        comment.set('content', data.content);
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
        blog.comments.push(
            {
                _id: savedComment.id,
                content: savedComment.content,
                author: savedComment.author
            }
        );

        await blog.save()
        console.log(`comment:${data.id} updated successfully`)

        msg.ack()  
    }
}