import request from 'supertest'
import mongoose from 'mongoose'
import app from '../../app'
import Post from '../../models/post'
import Comment from '../../models/comment'
import {natsWrapper} from '../../natsWrapper'

it("returns 404 if the post is not found", async ()=>{
    const commentId = new mongoose.Types.ObjectId().toHexString()
    const cookie = global.getCookie('lkit','test@test.com')

    await request(app)
     .put(`/api/comments/${commentId}`)
     .set('Cookie', cookie)
     .send({content:'its very intresting'})
     .expect(404)
});


it('returns 401 when you try to update a comment that is not yours', async ()=>{
    const postId = new mongoose.Types.ObjectId().toHexString()
    const cookie = global.getCookie('lkth', 'test@test.com')

    const post = Post.build({
        _id: postId,
        version: 1
    })
    await post.save()

    let comments = await Comment.find({})

    await request(app)
      .post(`/api/comments/${postId}`)
      .set('Cookie',cookie)
      .send({content:'Its a great day'})
      .expect(201)
      comments = await Comment.find({})
    expect(comments.length).toEqual(1)

    await request(app)
      .put(`/api/comments/${comments[0]._id}`)
      .set('Cookie', global.getCookie('lky','test@test.com'))
      .send({content: 'its very intresting'})
      .expect(401)
});

it('returns 200 on sucessfuly updating a comment', async()=>{
    const postId = new mongoose.Types.ObjectId().toHexString()
    const cookie = global.getCookie('lkth', 'test@test.com')

    const post = Post.build({
        _id: postId,
        version: 1
    })
    await post.save()

    let comments = await Comment.find({})

    await request(app)
      .post(`/api/comments/${postId}`)
      .set('Cookie',cookie)
      .send({content:'Its a great day'})
      .expect(201)
      comments = await Comment.find({})
    expect(comments.length).toEqual(1)

    await request(app)
      .put(`/api/comments/${comments[0]._id}`)
      .set('Cookie', cookie)
      .send({content:'its very intresting'})
      .expect(200)
});

it('publishes an event when updating a comment', async ()=> {
  const postId = new mongoose.Types.ObjectId().toHexString()
    const cookie = global.getCookie('lkth', 'test@test.com')

    const post = Post.build({
        _id: postId,
        version: 1
    })
    await post.save()

    let comments = await Comment.find({})

    await request(app)
      .post(`/api/comments/${postId}`)
      .set('Cookie',cookie)
      .send({content:'Its a great day'})
      .expect(201)
      comments = await Comment.find({})
    expect(comments.length).toEqual(1)

    await request(app)
      .put(`/api/comments/${comments[0]._id}`)
      .set('Cookie', cookie)
      .send({content:'its very intresting'})
      .expect(200)
      expect(natsWrapper.client.publish).toHaveBeenCalled()
});