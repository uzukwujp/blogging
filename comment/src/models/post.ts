import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'


interface Attr {
    _id:string;
    version: number;
}

interface PostDoc extends mongoose.Document{
    version:number;
}

interface PostModel extends mongoose.Model<PostDoc>{
    build(Attr:Attr):PostDoc
}

const postSchema = new mongoose.Schema<PostDoc>({
    _id: {type:String, required: true}
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id
        }
    }
});

postSchema.set('versionKey', 'version');
postSchema.plugin(updateIfCurrentPlugin);

postSchema.statics.build = (Attr:Attr) => {
    return new Post(Attr)
};

const Post = mongoose.model<PostDoc, PostModel>('Post', postSchema);



export default Post;