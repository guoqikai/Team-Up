"use strict";

const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectID;

const MessageGroupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: {
        type: [ObjectId],
        required: true,
        default: []
    }
});


const MessageGroup = mongoose.model("MessageGroup", MessageGroupSchema);

module.exports = { MessageGroup };