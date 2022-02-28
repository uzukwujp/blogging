import request from "supertest"
import app from "../../app";


// when there is no account
it("returns 400 status code when there is no account", async ()=>{
    await request(app)
           .post("/api/users/signin")
           .send({
               password:"password",
               email:"test@test.com"
           })
           .expect(404)
});


it("returns 400 status code if an invalid password is supplied", async()=>{
    await request(app)
            .post("/api/users/signup")
            .send({
         
                email: "jay@gmail.com",
                password: "1234567",
                name: "uzukwu"
            })
            .expect(201)

    await request(app)
           .post("/api/users/signin")
           .send({
               email:"jay@gmail.com",
               password:"p176890"
           })  
           .expect(400)      
});


it("returns 400 status code if an invalid email is supplied", async ()=>{
    await request(app)
            .post("/api/users/signup")
            .send({
                name:"john",
                password:"password",
                email:"test@test.com"
            })
            .expect(201)

    await request(app)
           .post("/api/users/signin")
           .send({
               email:"test@test1.com",
               password:"password"
           })  
           .expect(404)      
});

it("returns 200 status code on successful signup", async ()=>{
    await request(app)
            .post("/api/users/signup")
            .send({
                name:"john",
                password:"password",
                email:"test@test.com"
            })
            .expect(201)

    await request(app)
           .post("/api/users/signin")
           .send({
               email:"test@test.com",
               password:"password"
           })  
           .expect(200)      
});


it("sets a header upon a successful signin", async () => {
     await request(app)
            .post("/api/users/signup")
            .send({
                    name:"john",
                    email:"test@test.com",
                    password:'password'
                })
            .expect(201)

   const res = await request(app)
                      .post("/api/users/signin")
                      .send({
                          email:"test@test.com",
                          password:"password"
                      })
                      .expect(200)
               expect(res.get('Set-Cookie')).toBeDefined()              
});



