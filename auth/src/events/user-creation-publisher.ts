import { BasePublisher, Subjects} from '@jaypeeblogs/common';

interface UserCreation{
    subject:Subjects,
    data:{id:string, name:string, email:string, version:number}
};


export class UserCreationPublisher extends BasePublisher<UserCreation>{
    subject:Subjects.userCreatiion = Subjects.userCreatiion;
}