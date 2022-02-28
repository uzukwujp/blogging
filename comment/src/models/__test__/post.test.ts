import Post from '../post'
import mongoose from 'mongoose'


it('implements optimistic concurrency control', async ()=> {
    const postId = new mongoose.Types.ObjectId().toHexString()
    const post = Post.build({
        _id: postId,
        version: 0
    })
    await post.save()

    const firstPostInstance = await Post.findById({_id: post.id})
    const secondPostInstance = await Post.findById({_id: post.id})
    await firstPostInstance!.save()
    try{
        await secondPostInstance!.save()
    }catch(err){
        return
    }

    throw new Error('should not get here')
});

it('increments the version number on multiple saves in the database', async ()=>{
    const postId = new mongoose.Types.ObjectId().toHexString()
    const post = Post.build({
        _id: postId,
        version: 0
    })
    await post.save()

    const firstPostInstance = await Post.findById({_id: post.id})
    await firstPostInstance!.save()
    expect(firstPostInstance!.version).toEqual(1)
    await firstPostInstance!.save()
    expect(firstPostInstance!.version).toEqual(2)

});