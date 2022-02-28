import { UserCreation } from "../user-creation-listener"
import mongoose from 'mongoose'
import { Message } from "node-nats-streaming";
import { natsWrapper } from "../../natsWrapper";
import { UserCreationListener } from "../user-creation-listener";
import Author from "../../models/author";

const setUp = () => {
    const data: UserCreation['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'John',
        email: 'test@test.com',
        version: 0
    };
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    const listener = new UserCreationListener(natsWrapper.client)

    return { msg, data, listener}
}

it('creates a new user', async ()=> {
    const {data, msg, listener} = setUp()

    await listener.onMessage(data,msg)
    const user = await Author.findById({_id: data.id})
    expect(user).toBeDefined()
    expect(user!.name).toEqual('John')
});

it('validates that msg.ack on UserCreation listener is called', async ()=> {
    const {data, msg, listener} = setUp()

    await listener.onMessage(data,msg)
    expect(msg.ack).toHaveBeenCalled()

});