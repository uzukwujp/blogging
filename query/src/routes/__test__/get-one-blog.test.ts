import Author from '../../models/author'
import Comment from '../../models/comment'
import mongoose from 'mongoose'
import Blog from '../../models/blog'
import request from 'supertest'
import app from '../../app'

const setUp = async ()=> {

    const author = Author.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: 'John'
    })

    await author.save()

    const author2 = Author.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: 'John'
    })

    await author2.save()

    const comment = Comment.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        content: 'Very good',
        status: 'approved',
        author: author._id
    })

    await comment.save()

    const comment2 = Comment.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        content: 'Awesome',
        status: 'pending',
        author: author._id
    })

    await comment2.save()

    const blog1 = Blog.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        topic: 'Tech',
        body: 'Very Lucrative',
        author: author2._id
    })

    await blog1.save()
    blog1.comments.push(comment._id)
    await blog1.save()


    const blog2 = Blog.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        topic: 'Technical Writing',
        body: 'Very Lucrative',
        author: author._id
    })

    await blog2.save()
    blog1.comments.push(comment2._id)
    await blog2.save()

    return {blog1, blog2}
};


it ('returns 200 on successfully fectching the blog', async () => {
    const {blog1, blog2} = await setUp()


    const response = await request(app)
           .get(`/api/blogs/${blog1._id}`)
           .set('Cookie', global.getCookie('lkj', 'test@test.com'))
           .send({})
           .expect(200)

           console.log(response.body)         
});

