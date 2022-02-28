import mongoose from 'mongoose';
// defines the type author
interface Author {
    _id: string,
    name: string,
};

// defines the type of a comment
interface Comment {
    _id: string
    content: string,
    author: {
        name: string
    }
};

// defines the properties required to make a blog
interface Attr {
    _id: string,
    topic: string,
    body: string
    author: Author
};

// defines the properties of a blog document
export interface BlogDoc extends mongoose.Document {
    topic: string,
    body: string,
    author: Author,
    comments: Comment[]
};

// Adds build function to the Blog schema
interface BlogModel extends mongoose.Model<BlogDoc> {
    build(Attr: Attr): BlogDoc
}



const blogSchema = new mongoose.Schema<BlogDoc>({
    _id: {type:String, required:true},
    topic: {type:String, required:true},
    body: {type:String, required:true},
    author : {type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true},
    comments: [{type: mongoose.Schema.Types.ObjectId, ref:'Comment', required: true}]
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v
        }
    }
});

blogSchema.statics.build = (Attr:Attr)=> {
    return new Blog(Attr)
};

const Blog = mongoose.model<BlogDoc, BlogModel>('Blog', blogSchema);

export default Blog;