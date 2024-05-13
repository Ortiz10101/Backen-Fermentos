import mongoose, { Schema } from "mongoose";
import IUser from "../interface/user.interface";

const userSchema: Schema = new Schema<IUser>({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true},
    salt: { type: String},
    role: { type: String}
}, {collection: 'user'})

const User = mongoose.model('user', userSchema)
export default User