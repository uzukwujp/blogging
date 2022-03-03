import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming';

import Comment from '../models/comment';
import Blog from '../models/blog'

export interface CommentDeleted {
    subject:Subjects,
    data: {
        id:string,
        postId:string
        version:number
    }

};


export class CommentDeleteListener extends BaseListener < CommentDeleted> {

    subject:Subjects.commentDeleted = Subjects.commentDeleted

    queuegroup = 'query-service'

    async onMessage(data:CommentDeleted['data'], msg:Message) {

        await Comment.deleteOne(
            {
                _id: data.id,
                
            }
        );

        const blog = await Blog.findById(
            {
                _id: data.postId
            }
        )

        if(blog){

            const comments = blog.comments.filter((comment)=> comment._id !== data.id)
            blog.comments = comments;
            await blog.save()
            msg.ack()
        }
    }
}