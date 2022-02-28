import { Mongoose } from 'mongoose'
import Author from '../author'
import Comment from '../comment'
import mongoose from 'mongoose'

const setUp = async () => {
    const author = Author.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: 'John'
    })

    await author.save()

    const comment = Comment.build({
        _id: new mongoose.Types.ObjectId().toHexString(),
        content: 'vary good',
        status: 'approved',
        author: author._id
    })

    await comment.save()

    return { author, comment}
};

it('prevents saving document out of order', async ()=>{
    const { comment} = await setUp()
    const firstCommentInstance = await Comment.findById({_id: comment._id})
    const secondcommentInstance = await Comment.findById({_id: comment._id})

    await firstCommentInstance!.save()
    try{
        await secondcommentInstance!.save()
    }catch(err){
        return
    }

    throw new Error('should not get here if above is true')
});

it('increments version number on multiple saves', async ()=> {
    const { comment} = await setUp()
    const firstCommentInstance = await Comment.findById({_id: comment._id})

    await firstCommentInstance!.save()
    expect(firstCommentInstance!.version).toEqual(1)

    await firstCommentInstance!.save()
    expect(firstCommentInstance!.version).toEqual(2)
});