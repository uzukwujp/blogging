import {Subjects, BasePublisher} from '@jaypeeblogs/common';

interface PostDeleted {
    subject:Subjects,
    data:{
        id:string,
        version:number
    }
};

export class PostDeletedPublisher extends BasePublisher<PostDeleted> {
    subject:Subjects.postDeleted = Subjects.postDeleted

}