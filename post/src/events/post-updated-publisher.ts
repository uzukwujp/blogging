import {Subjects, BasePublisher} from '@jaypeeblogs/common';

interface PostUpdated {
    subject:Subjects,
    data:{
    id:string,
    body:string,
    topic:string
    version: number
   }
};

export class PostUpdatedPublisher extends BasePublisher<PostUpdated>{

    subject:Subjects.postUpdated = Subjects.postUpdated;
}