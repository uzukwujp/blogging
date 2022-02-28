import {Subjects, BasePublisher} from '@jaypeeblogs/common';

interface CommentUpdated {
    subject:Subjects,
    data:{
        id:string,
        postId:string,
        content:string
        version:number,
        status:string
    }
};

export class CommentUpdatedPublisher extends BasePublisher<CommentUpdated> {
    subject:Subjects.commentUpdated = Subjects.commentUpdated
};