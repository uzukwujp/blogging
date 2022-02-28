import {Subjects, BasePublisher} from '@jaypeeblogs/common'

interface CommentCreation {
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

export class CommentModerationPublisher extends BasePublisher<CommentCreation> {
    subject:Subjects.commentModeration = Subjects.commentModeration;
}
