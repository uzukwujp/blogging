import {Subjects, BasePublisher} from '@jaypeeblogs/common';

interface PostCreation {
    subject:Subjects,
    data:{postId:string,
         topic:string,
        body:string,
        author:string
        version: number
    };
}

export class PostCreationPublisher extends BasePublisher<PostCreation> {
    
    subject:Subjects.postCreation = Subjects.postCreation;
}