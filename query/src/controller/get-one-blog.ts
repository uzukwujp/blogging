import { Request, Response } from "express";
import Blog from '../models/blog';

export const getOneBlog = async (req:Request, res:Response) => {

    const { postId } = req.params;

    const blog = await Blog.findById({ _id: postId })
    .populate('author', {name: 1})
    .populate([
        {
            path: 'comments',
            model: 'Comment',
            select: 'content status',
            populate : {
                path: 'author',
                model: 'Author',
                select: 'name'
            }
        }
    ]).exec()

    res.send(blog);

}
