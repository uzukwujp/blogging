import mongoose from 'mongoose'
import Author from '../author'
import Post from '../post'

const setUp = async () => {
    const author = Author.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: 'John'
    })

    await author.save()

    const post = Post.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        topic: 'Technical Writting',
        body: 'Very Lucrative',
        author: author._id
    })

    await post.save()

    return { author, post}
};

it('prevents saving post documents out of order', async ()=>{
    const { post } = await setUp()
    const firstPostInstance = await Post.findById({_id: post._id})
    const secondPostInstance = await Post.findById({_id: post._id})

    await firstPostInstance!.save()
    try{
        await secondPostInstance!.save()
    }catch(err){
        return
    }

    throw new Error('should not get here if above is true')
})

it('increments the version number of post documents on multiple save', async ()=> {
    const { post} = await setUp()
    const firstPostInstance = await Post.findById({_id: post._id})

    await firstPostInstance!.save()
    expect(firstPostInstance!.version).toEqual(1)

    await firstPostInstance!.save()
    expect(firstPostInstance!.version).toEqual(2)
})