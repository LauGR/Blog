// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    local: {
        nom: {
            type: String,
            required: true,
            unique: true
        },
        prenom: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        avatar: {
            type: mongoose.Schema.Types.Mixed,
            required: false
        },
        role: {
            type: String,
            default: "member"
        },
        isAdmin: {
            type: Boolean,
            default: "false"
        }
    }

});

// generating a hash
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.isMember = function () {
    return (this.role === "member");
};
userSchema.methods.isAdmin = function () {
    return (this.role === "admin");
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);