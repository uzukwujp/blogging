import request from 'supertest';
import mongoose from 'mongoose'
import Post from '../../models/post'
import Comment from '../../models/comment'

import app from '../../app'
import { natsWrapper } from '../../natsWrapper';


// can not create a comment for a post that is not available
it("returns 404  when creating comment for a post that is not available", async ()=> {
    const cookie = global.getCookie('ijkl', 'test@test.com');
    const postId = new mongoose.Types.ObjectId().toHexString()

    await request(app)
      .post(`/api/comments/${postId}`)
      .set('Cookie', cookie)
      .send({
          content: 'very intresting'
      })
      .expect(404)   
});

it('returns 201 on successful post creation', async ()=> {
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
});

it('publishes an event when creating a comment', async ()=> {
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
    expect(natsWrapper.client.publish).toHaveBeenCalled()

})

