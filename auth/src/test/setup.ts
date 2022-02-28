import mongoose from 'mongoose'
import {MongoMemoryServer} from 'mongodb-memory-server'
import request from 'supertest';

import app from '../app'



declare global {
    var getCookie: () => Promise<string[]>;
  }


let mongod:any
jest.setTimeout(120000)
jest.mock('../natswrapper.ts')

beforeAll( async ()=> {
    process.env.JWT = 'john';
    mongod = await MongoMemoryServer.create();

    const uri = mongod.getUri();

    await mongoose.connect(uri)
});


beforeEach(async ()=> {
    jest.clearAllMocks()

    const collections = await mongoose.connection.db.collections();
    for (let collection of collections){
        await collection.deleteMany({})
    }
})

afterAll( async ()=> {
    await mongod.stop()

    await mongoose.connection.close()
});


global.getCookie =  async ()=>{

    const res = await request(app)
        .post("/api/users/signup")
        .send({
                name:"john",
                email:"test@test.com",
                password:'password'
            })
            .expect(201)
        return res.get('Set-Cookie')
};
