import {MongoMemoryServer} from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'


declare global {
    var getCookie: (id: string, email: string)=> string[]
};


jest.mock("../natsWrapper.ts")
let mongod:any;
beforeAll(async ()=>{
    
    process.env.JWT="john"
    mongod = await MongoMemoryServer.create()
    const Uri = mongod.getUri()
    await mongoose.connect(Uri)
});

beforeEach(async()=>{
    jest.clearAllMocks()
    const collections = await mongoose.connection.db.collections()
    for (let collection of collections ){
        await collection.deleteMany({})
    }
});

afterAll(async()=>{
    await mongoose.connection.close()
    await mongod.stop()
});

global.getCookie = (id: string, email: string)=>{
    const payload = {
        id : id,
        email: email
    }

    const token = jwt.sign(payload, process.env.JWT!)
    const session = {
        token: token
    }

    const base64 = Buffer.from(JSON.stringify(session)).toString('base64')

    return [`express:sess=${base64}`]

}