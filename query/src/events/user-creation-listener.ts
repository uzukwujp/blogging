import {Subjects, BaseListener} from '@jaypeeblogs/common';
import {Message} from 'node-nats-streaming';

import Author from '../models/author';



export interface UserCreation {

    subject:Subjects,
    
    data:{
        id:string, 
        name:string, 
        email:string, 
        version:number
    }
};

export class UserCreationListener extends BaseListener<UserCreation> {

    subject:Subjects.userCreatiion = Subjects.userCreatiion

    queuegroup = 'query-service'

    async onMessage(data:UserCreation['data'], msg:Message) {

        const author = Author.build({_id:data.id, name: data.name})

        await author.save()
        console.log(`saved author:${author._id} successfully`)

        msg.ack()
    }
};

