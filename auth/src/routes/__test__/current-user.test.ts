import request from 'supertest'
import app from '../../app'


it('returns details of the currentuser', async ()=> {
    const res = await request(app)
                 .post("/api/users/signup")
                 .send({
                     name:'john',
                     email:'test@test.com',
                     password:'password'
                 })
                 .expect(201)


    const cookie = res.get('Set-Cookie')             

    const response = await request(app)
                      .get('/api/users/currentuser')
                      .set('Cookie',cookie)
                      .send()
                      .expect(200)
                expect(response.body.currentUser.email).toEqual('test@test.com')  
});


it("sets currentUser to null if user is not authenticated", async ()=> {
    const response =  await request(app)
           .get("/api/users/currentuser")
           .send()
           .expect(200)
        expect(response.body.currentUser).toEqual(null)       
});