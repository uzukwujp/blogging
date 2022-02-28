import request from 'supertest'
import app from "../../app"
import Users from '../../model/user'
import {natsWrapper} from '../../natswrapper';


it("returns status 201 on successful signup", async()=>{
    return request(app)
     .post("/api/users/signup")
     .send({
         
         email: "jay@gmail.com",
         password: "1234567",
         name: "uzukwu"
     })
     .expect(201)
});

it("returns 400 status code with a missing name argument", async ()=>{
    await request(app)
           .post("/api/users/signup")
           .send({
               email:"ja@gmail.com",
               password:"password"
           })
           .expect(400)
});

it("returns 400 status code with an invalid email", async ()=>{
    await request(app)
           .post("/api/users/signup")
           .send({
               email:"assdd",
               password:"password",
               name:"john"
           })
           .expect(400)
});

it("return 400 status code with an already existing user", async()=>{
    await request(app)
           .post("/api/users/signup")
           .send({
               name: "john",
               password: "password",
               email: "test@test.com"
           })
           .expect(201)

    await request(app)
           .post("/api/users/signup")
           .send({
               name: "john",
               password: "password",
               email: "test@test.com"
           })
           .expect(400)                 
});

it("returns status code 400 for an invalid password", async ()=>{
    await request(app)
           .post("/api/users/signup")
           .send({
               email: "jay@gmail.com",
               password: "p",
               name: "john"
           })
           .expect(400)
});



it("sets a header upon successful signup", async ()=>{
    let users = await Users.find({})
     const res = await request(app)
     .post("/api/users/signup")
     .send({
         
         email: "jay@gmail.com",
         password: "1234567",
         name: "uzukwu"
     })
     .expect(201)
    users = await Users.find({})
expect(res.get('Set-Cookie')).toBeDefined()
expect(users.length).toEqual(1)
});

it('publishes an event', async ()=> {
    return request(app)
    .post("/api/users/signup")
    .send({
        
        email: "jay@gmail.com",
        password: "1234567",
        name: "uzukwu"
    })
    .expect(201)
 expect(natsWrapper.client.publish).toHaveBeenCalled()

});