import mongoose from 'mongoose'
import request from 'supertest'
import app from '../../app'
import Post from '../post'
import Comment from '../comment'

it('it implements optimistic concurrency control', async ()=> {
    const postId = new mongoose.Types.ObjectId().toHexString()
    const cookie = global.getCookie('lkth', 'test@test.com')

    const post = Post.build({
        _id: postId,
        version: 1
    })
    await post.save()

   const res = await request(app)
      .post(`/api/comments/${postId}`)
      .set('Cookie',cookie)
      .send({content:'Its a great day'})
      .expect(201)
    const firstCommentInstance = await Comment.findById({_id: res.body.id})
    const secondCommentInstance = await Comment.findById({_id: res.body.id})
    await firstCommentInstance!.save()
    try{
        await secondCommentInstance!.save()
    }catch(err){
        return
    }

    throw new Error('should not get to this point')
});


it('increments version number on multiple saves to the database', async ()=>{
    const postId = new mongoose.Types.ObjectId().toHexString()
    const cookie = global.getCookie('lkth', 'test@test.com')

    const post = Post.build({
        _id: postId,
        version: 1
    })
    await post.save()

   const res = await request(app)
      .post(`/api/comments/${postId}`)
      .set('Cookie',cookie)
      .send({content:'Its a great day'})
      .expect(201)
    const firstCommentInstance = await Comment.findById({_id: res.body.id})
    await firstCommentInstance!.save()
    expect(firstCommentInstance!.version).toEqual(1)
    await firstCommentInstance!.save()
    expect(firstCommentInstance!.version).toEqual(2)

})