"use strict";

const mongoose = require('mongoose')
const ObjectId = require('mongodb').ObjectID;

const UserSubscriptionsSchema = new mongoose.Schema({
    uid: {
        type: ObjectId,
        required: true,
        unique: true
    },
    subscriptions: {
        type: [ObjectId],
        required: true,
        default: []
    }
});


const UserSubscriptions = mongoose.model("UserSubscriptions", UserSubscriptionsSchema);

module.exports = { UserSubscriptions };