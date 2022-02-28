import {Response, Request} from 'express';
import Blog from '../models/blog';


export const getAllBlogs = async (req:Request, res:Response) => {



    const blogs = await Blog.find({}).populate('author', {name: 1})
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

    res.send(blogs)
};