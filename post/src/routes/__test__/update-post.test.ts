import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import {natsWrapper} from '../../natswrapper'



it('returns 400 if you supply invalid inputs', async ()=>{

    const cookie = global.getCookie("lkjht", 'test@test.com')
    const postId = new mongoose.Types.ObjectId().toHexString()

    await request(app)
     .put(`/api/posts/${postId}`)
     .set('Cookie', cookie)
     .send({
         topic:6,
         body:'very lucrative'
     })
     .expect(400)  
     
     await request(app)
     .put(`/api/posts/${postId}`)
     .set('Cookie', cookie)
     .send({
         topic:'Technical writting',
         body:true
     })
     .expect(400)       
});

it("returns status code 404 if post do not exit", async ()=> {
    const cookie = global.getCookie('lkbnjk', 'test@test.com')
    const postId = new mongoose.Types.ObjectId().toHexString()

    return request(app)
     .put(`/api/posts/${postId}`)
     .set('Cookie', cookie)
     .send({
         topic: 'Technical Writing',
         body:'Its very lucrative'
     })
     .expect(404)
});

it("returns 401 if you are not the owner of the post you wish to update", async () => {
    const cookie = global.getCookie('lkm',"test@test.com")
    const res = await request(app)
                 .post('/api/posts')
                 .set('Cookie',cookie)
                 .send({
                     topic:'Technical Writing',
                     body:'Very Lucrative'
                 })
                 .expect(201)
                

    const cookie2 = global.getCookie('klm','test@test.com')
                     await request(app)
                       .put(`/api/posts/${res.body.id}`)
                       .set('Cookie',cookie2)
                       .send({
                           topic:"Technical Writing",
                           body:'But it is difficult and tedious'
                       })
                       .expect(401)
});

it('returns 200 on successful update', async ()=>{
    const cookie = global.getCookie('lkm',"test@test.com")
    const res = await request(app)
                 .post('/api/posts')
                 .set('Cookie',cookie)
                 .send({
                     topic:'Technical Writing',
                     body:'Very Lucrative'
                 })
                 .expect(201)
                

    
                await request(app)
                 .put(`/api/posts/${res.body.id}`)
                 .set('Cookie',cookie)
                 .send({
                        topic:"Technical Writing",
                        body:'But it is difficult and tedious'
                       })
                       .expect(200)

});

it('publishes an event', async ()=> {
    const cookie = global.getCookie('lkm',"test@test.com")
    const res = await request(app)
                 .post('/api/posts')
                 .set('Cookie',cookie)
                 .send({
                     topic:'Technical Writing',
                     body:'Very Lucrative'
                 })
                 .expect(201)
                

    
                await request(app)
                 .put(`/api/posts/${res.body.id}`)
                 .set('Cookie',cookie)
                 .send({
                        topic:"Technical Writing",
                        body:'But it is difficult and tedious'
                       })
                       .expect(200)
            expect(natsWrapper.client.publish).toHaveBeenCalled()

})
