import request from "supertest"
import app from "../../app"

it ('returns 401 status code if not authenticated', async ()=> {
    await request(app)
     .post("/api/users/signout")
     .send({})
     .expect(401)
});

it ('returns status code 200 on successful signout', async ()=>{

    const cookie = await global.getCookie();

    const res = await request(app)
      .post("/api/users/signout")
      .set('Cookie', cookie)
      .expect(200)
    expect(res.get('Set-Cookie'))
    .toEqual([ 'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'])
});


