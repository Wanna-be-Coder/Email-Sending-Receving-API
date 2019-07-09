const mongoose = require("mongoose");
const passportLocalMongooose = require("passport-local-mongoose");



const DocSchema = mongoose.Schema({
    docName:String,
    doc:String,
    docPublisher: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
            }
    },
    docTimeStamp: {type : Date, default: Date.now},
    b_Approval:Boolean,
    b_TimeStamp: Date,
    c_Approval:Boolean,
    c_Approval: Date
});

UserSchema.plugin(passportLocalMongooose);

module.exports = mongoose.model("Doc",DocSchema);