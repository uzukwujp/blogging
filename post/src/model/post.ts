import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface Attr {
    topic:string,
    body:string
    author:string;
}

interface PostDoc extends mongoose.Document{
    topic:string,
    body:string,
    author:string
    version: number
    
}

interface PostModel extends mongoose.Model<PostDoc> {
    build(Attr:Attr):PostDoc
}

const postSchema = new mongoose.Schema<PostDoc>({
    topic:{type:String, required: true},
    body: {type:String, required:true},
    author: {type:String, required:true}
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    }
});

postSchema.set('versionKey', 'version');
postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (Attr:Attr)=> {
    return new Post(Attr);
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);

export default Post;