"use strict";

const mongoose = require('mongoose');
const ObjectId = require('mongodb').ObjectID;

const MessageSchema = new mongoose.Schema({
    from: {
        type: ObjectId,
        required: true
    },
    to: {
        type: ObjectId,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    viewed: {
        type: Boolean,
        default: false
    },
    created: { 
        type: Date, 
        default: Date.now 
    }
});

const Message = mongoose.model("Message", MessageSchema);

module.exports = { Message };