import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

// properties of the object required to make an author
interface Attr {
    _id: string,
    name: string
};

// Adds name property to the author document
interface AuthorDoc extends mongoose.Document {
    name: string
};

//Adds build function to the author schema or model
interface AuthorModel extends mongoose.Model<AuthorDoc> {
    build(Attr:Attr):AuthorDoc
}

const authorSchema = new mongoose.Schema<AuthorDoc>({
    _id: {type: String, required: true},
    name:{type: String, required: true}
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v
        }
    }
});

authorSchema.set('versionKey', 'version');
authorSchema.plugin(updateIfCurrentPlugin);

authorSchema.statics.build = (Attr:Attr) => {
    return new Author(Attr)
};

const Author = mongoose.model<AuthorDoc, AuthorModel> ('Author', authorSchema);

export default Author;