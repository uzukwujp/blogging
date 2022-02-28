import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'

// defines the type author
interface Author {
    _id: string,
    name: string,
};

// defines the of the input value of the build function
interface Attr {
    _id: string,
    content: string,
    status: string
    author: Author
};
// Adds properties to the comment document
interface CommentDoc extends mongoose.Document {
    content: string,
    author: Author,
    status: string,
    version: number
};

// Adds property build to the comment model
interface CommentModel extends mongoose.Model<CommentDoc> {
    build(Attr:Attr): CommentDoc
};

const commentSchema = new mongoose.Schema <CommentDoc>({
    _id: {type: String, required: true},
    content: {type: String, required: true},
    status: {type: String, required: true},
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v
        }
    }
});

commentSchema.set('versionKey', 'version')
commentSchema.plugin(updateIfCurrentPlugin);

commentSchema.statics.build = (Attr: Attr) => {
    return new Comment(Attr)
};

const Comment = mongoose.model<CommentDoc, CommentModel>('Comment', commentSchema);

export default Comment;