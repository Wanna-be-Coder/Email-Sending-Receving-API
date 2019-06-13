var mongoose = require("mongoose");
var passportLocalMongooose = require("passport-local-mongoose");



var UserSchema = mongoose.Schema({
    username:String,
    password:String,
    role:String
});

UserSchema.plugin(passportLocalMongooose);

module.exports = mongoose.model("User",UserSchema);