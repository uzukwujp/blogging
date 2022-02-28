import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming';

import Author from '../models/author'
import Comment from '../models/comment';
import Blog from '../models/blog';

export interface CommentCreation {
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


export class CommentCreationListener extends BaseListener  <CommentCreation> {

    subject:Subjects.commentCreation = Subjects.commentCreation

    queuegroup = 'query-service'

    async onMessage(data:CommentCreation['data'], msg:Message) {

        const author = await Author.findById({_id: data.author});

        if(!author) {
            return   
        }

        const comment = Comment.build(
            {
                _id: data.id,
                content: data.content,
                status: data.status,
                author
            }
        )

       const savedComment =  await comment.save()

        const blog = await Blog.findById({_id: data.postId});

        if(!blog){
        
            return 
        }

        blog.comments.push(savedComment._id)

        await blog.save()
        console.log(`saved comment:${savedComment._id} successfully`)

        msg.ack() 
    }

}