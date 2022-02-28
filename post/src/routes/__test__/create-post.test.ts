
import app from "../../app"
import request from "supertest";
import Post from '../../model/post'
import {natsWrapper} from '../../natswrapper'


it('returns status code 401 when user is not authenticated', async()=>{
    await request(app)
      .post("/api/posts")
      .send({
          topic:"Technical Writting",
          body: "Its a lucrative field"
      })
      .expect(401)
});

it('return status code 201 when successful', async()=>{
    const cookie = global.getCookie("lkjgt", "test@test.com")
    let posts = await Post.find({})
    await request(app)
           .post('/api/posts')
           .set('Cookie',cookie)
           .send({
               topic: "Technical Writting",
               body: "Its a lucrative field"
           })
           .expect(201)
    posts = await Post.find({})
    expect(posts.length).toEqual(1)
});

it('returns  400 for invalid arguments', async ()=>{

    const cookie = global.getCookie("lkjgt", "test@test.com")
    await request(app)
           .post('/api/posts')
           .set('Cookie',cookie)
           .send({
               topic: 6,
               body: "Its a lucrative field"
           })
           .expect(400)

           
           await request(app)
                  .post('/api/posts')
                  .set('Cookie',cookie)
                  .send({
                      topic: "Technical Writting",
                      body: true
                  })
                  .expect(400)
});

it("returns 400 when user supplies in complete arguments", async()=>{
    const cookie = global.getCookie('lkjht','test@test.com')
    await request(app)
           .post('/api/posts')
           .set('Cookie',cookie)
           .send({
               
               body: "Its a lucrative field"
           })
           .expect(400)

});

it('publishes an event', async ()=> {
    const cookie = global.getCookie("lkjgt", "test@test.com")
    let posts = await Post.find({})
    await request(app)
           .post('/api/posts')
           .set('Cookie',cookie)
           .send({
               topic: "Technical Writting",
               body: "Its a lucrative field"
           })
           .expect(201)
    posts = await Post.find({})
    expect(posts.length).toEqual(1)
  expect(natsWrapper.client.publish).toHaveBeenCalled()

})


