import mongoose from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

export interface UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}



const UserSchema = new mongoose.Schema(
    {
    email:{type: "string",required: true,unique: true},
    name:{type: "string",required: true},
    password:{type: "string",required: true},
    },
   { timestamps: true}
);

UserSchema.pre<UserDocument>("save", async function (next) {
    const user = this; // `this` is already typed as `UserDocument`

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor")); // Ensure the type of saltWorkFactor is correct
    user.password = await bcrypt.hash(user.password, salt);

    next();
}); 



//Used for logging in

UserSchema.methods.comparePassword= async function(candidatePassword:string) {
    const user = this as UserDocument;

    return bcrypt.compare(candidatePassword,user.password).catch((e) => false);
}

const User = mongoose.model<UserDocument>("User",UserSchema);

export default User;