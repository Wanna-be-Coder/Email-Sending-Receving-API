import mongoose, { Schema, Document } from 'mongoose';
import passportLocalMongooose from 'passport-local-mongoose';

// const mongoose = require("mongoose");
// const passportLocalMongooose = require("passport-local-mongoose");

  export interface IUser extends Document {
    username: string,
    position: string
  }


const UserSchema =  new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  position: {type:String, required:true}
});

UserSchema.plugin(passportLocalMongooose);

export default mongoose.model<IUser>('User', UserSchema);