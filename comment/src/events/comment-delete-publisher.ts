import {Subjects, BasePublisher} from '@jaypeeblogs/common'

interface CommentDeleted {
    subject:Subjects,
    data: {
        id:string,
        postId:string
        version:number
    }

};

export class CommentDeletedPublisher extends BasePublisher<CommentDeleted> {
    subject:Subjects.commentDeleted = Subjects.commentDeleted
};