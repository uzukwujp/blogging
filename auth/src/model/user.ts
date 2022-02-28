import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'


// defines the structure of the input to the build function
interface UserAttr {
    name:string,
    email:string,
    password:string
}

// extends mongoose document to add extra properties
interface UserDoc extends mongoose.Document {
    name:string,
    email:string,
    password:string
    version: number

}

// extends mongoose model by adding the build method
interface UserModel extends mongoose.Model<UserDoc>{
    build(Attr:UserAttr):UserDoc
}

const userSchema = new mongoose.Schema<UserDoc>({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true}
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
        }
    
    }

    
}); 
userSchema.set('versionKey', 'version');
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attr:UserAttr) =>{
    return new User(attr);
};

userSchema.pre('save', async function(done){
    if(this.isModified('password')){
       const hashed = await bcrypt.hash(this.get('password'), 10);
       this.set('password', hashed)
    }
    done();
});

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;