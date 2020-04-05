const mongoose = require('mongoose');
const Bcrypt = require("bcryptjs");

let Schema = mongoose.Schema;

let UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    Bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

UserSchema.pre("save", function(next) {
    if(!this.isModified('password')) {
        return next();  // do not hash password if user is already created or password not reset
    }
    this.password = Bcrypt.hashSync(this.password, 10);
    next();
});

module.exports = mongoose.model('users', UserSchema);