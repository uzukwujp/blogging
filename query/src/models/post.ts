import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

// defines the type author
interface Author {
    _id: string,
    name: string,
};

interface Attr {
    _id: string,
    body:string,
    topic:string,
    author:Author
};

export interface PostDoc extends mongoose.Document {
    body:string,
    topic:string,
    author:Author,
    version: number
};

interface PostModel extends mongoose.Model<PostDoc> {
    build(Attr:Attr):PostDoc

};


const postSchema = new mongoose.Schema<PostDoc>({
    _id: {type: String, required: true},
    topic: {type: String, required: true},
    body: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

postSchema.set('versionKey', 'version');
postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (Attr:Attr) => {

    return new Post(Attr)
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export default Post;

