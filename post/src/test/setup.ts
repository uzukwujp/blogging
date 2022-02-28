import {MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose"
import jwt from 'jsonwebtoken'



declare global {
    var getCookie: (id:string, email:string) => string[]
}

jest.mock('../natswrapper.ts')
jest.setTimeout(120000)
let mongod:any;

// create an in memory mongodb instance and connect through mongoose
beforeAll( async()=>{
    process.env.JWT = "john"

    mongod = await MongoMemoryServer.create()
    const Uri = mongod.getUri()

    await mongoose.connect(Uri)
});

// remove all entries in the database
beforeEach( async()=> {
    jest.clearAllMocks()

    const collections = await mongoose.connection.db.collections()

    for(let collection of collections){
        await collection.deleteMany({})
    }
})


//stop mongodb server and close connection
afterAll( async()=>{
    await mongod.stop()
    await mongoose.connection.close()
});


global.getCookie = (id:string, email:string) =>{

    const payload = {
        id,
        email
    }
    const token = jwt.sign(payload, process.env.JWT!)

    const session = {
        token:token
    }
   const base64 = Buffer.from(JSON.stringify(session)).toString('base64');

   return [`express:sess=${base64}`]
};