const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) { // Call with value
                throw new Error('Email is not valid');
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) { // Call with value
                throw new Error('Password is not strong: ' + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender Data Is not valid");
            }
        }
    },
    photoUrl: {
        type: String,
        validate(value) {
            if (!validator.isURL(value)) { // Call with value
                throw new Error('PhotoURL is not valid: ' + value);
            }
        }
    },
    about: {
        type: String,
        default: 'This is default value'
    },
    skills: {
        type: [String]
    }
}, { timestamps: true });

// DB level methods
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, 'shhhhh', {
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, user.password);
    return isPasswordValid;
};
// Creating a model
const User = mongoose.model('User', userSchema);
// Exporting the User model directly
module.exports = User;