import { CommentUpdated, CommentUpdatedListener } from "../comment-updated-listener";
import mongoose from 'mongoose'
import{Message} from "node-nats-streaming"
import { natsWrapper } from "../../natsWrapper";

const setUp = ()=>{

    const data: CommentUpdated['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        postId: new mongoose.Types.ObjectId().toHexString(),
        content: 'very good',
        author: 'John',
        status: 'pending',
        version: 0
    }

    const listener = new CommentUpdatedListener(natsWrapper.client)

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {data, msg, listener}
};

it('changes data.status to "approved" and publishes an event', async ()=> {
    const {data, msg, listener} = setUp()

    await listener.onMessage(data, msg)
    expect(data.status).toEqual('approved')
    expect(natsWrapper.client.publish).toHaveBeenCalled()
});


it('leaves data.status unchanged if status is equal to "approved" already', async ()=> {
    let {data, msg, listener} = setUp()
    data.status = "approved";
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled()
})