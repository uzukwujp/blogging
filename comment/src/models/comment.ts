import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'


interface Attr {
    postId:string,
    content:string,
    author:string
};

interface CommentDoc extends mongoose.Document{
    postId:string,
    content:string,
    author:string,
    status:string,
    version:number
};

interface CommentModel extends mongoose.Model<CommentDoc>{
    build(Attr:Attr):CommentDoc
};

const commentSchema = new mongoose.Schema<CommentDoc>({
    postId: {type:String, required:true},
    content:{type:String, required:true},
    status: {type:String, default: "pending"},
    author:{type:String, required:true}
},{
    toJSON: {
        transform(doc,ret){
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    }
});

commentSchema.set('versionKey', 'version');
commentSchema.plugin(updateIfCurrentPlugin);

commentSchema.statics.build = (Attr:Attr) => {
return new Comment(Attr);
};

const Comment = mongoose.model<CommentDoc, CommentModel>('Comment', commentSchema);


export default Comment;