import {Subjects, BasePublisher} from '@jaypeeblogs/common';

interface CommentApproval {
    subject:Subjects,
    data:{
        id:string,
        postId:string,
        content:string
        version:number,
        status:string
    }
};

export class CommentApprovalPublisher extends BasePublisher<CommentApproval> {
    subject:Subjects.commentApproval = Subjects.commentApproval
};