"use strict";

const webSocketServer = require('ws');
const { Message } = require("./models/message");
const { MessageGroup } = require("./models/message-group");
const { UserSubscriptions } = require("./models/user-subscriptions")

const wss = new webSocketServer.Server({
    noServer: true,
    clientTracking: false
})

const connections = new Map();

wss.on("connection", (ws, request) => {
    const senderId = String(request.user._id);
    ws.isAlive = true;
    connections.set(senderId, ws);
    ws.on("message", msgString => {
        try {
            const msg = JSON.parse(msgString);
            msg.created = Date.now();
            msg.from = senderId;
            if (String(msg.type) === "user" ) {
                UserSubscriptions.findOneAndUpdate({uid: msg.to, subscriptions: {$nin: msg.from}}, {$push: {subscriptions: msg.from}}).exec();
                UserSubscriptions.findOneAndUpdate({uid: msg.from, subscriptions: {$nin: msg.to}}, {$push: {subscriptions: msg.to}}).exec();
                if (connections.has(msg.to)) connections.get(msg.to).send(JSON.stringify(msg));
                if (connections.has(msg.from)) connections.get(msg.from).send(JSON.stringify(msg));
            }
            else {
                msg.type = "group"
                MessageGroup.findById(msg.to).then(group =>
                group.members.forEach(member => {
                    member = member.toString();
                    if (connections.has(member)) {
                        connections.get(member).send(JSON.stringify(msg));
                    }
                }));
            }
            new Message({
                from: msg.from,
                to: msg.to,
                content: msg.content,
            }).save().catch(error => console.log("Message save error:", error));
        }
        catch (error) {
            console.log("Json prase error:", error);
        }
    });
    ws.on("pong", () => { ws.isAlive = true });
});

const interval = setInterval(() => {
    connections.forEach((ws, userId) => {
        if (ws.isAlive === false) {
            connections.delete(userId);
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    });
}, 10000);

wss.on("close", () => {
    clearInterval(interval);
});

function getUserMessages(uid) {
    return Promise.all([ UserSubscriptions.findOne({uid: uid}), MessageGroup.find({members: {$in: uid}})]).then(
        vals => {
            const subscribedList = vals[0].subscriptions;
            const groups = vals[1]
            const promises = [];
            subscribedList.forEach(sub => {
                promises.push(Message.find({$or:[{ to: uid, from: sub }, { from: uid, to: sub}]}).sort({created: 1}).limit(40)
                    .then(msgs => { return { tabId: sub, members: [uid, sub], type: "user", msg: msgs}}));
            });
             groups.forEach(group => {
                promises.push(Message.find({to: group._id}).sort({created: 1}).limit(100)
                    .then(msgs => {return {tabId: group._id, tabName: group.name, members: group.members, type: "group", msg: msgs}}));
            });
            return Promise.all(promises)
        }
    );
}

function updateUserViewed(uid, sender) {
    return Message.updateMany({from: sender, to: uid}, {"$set": {"viewed": true}}).exec();
}

function addUserToGroup(uid, gid) {
    return MessageGroup.findOneAndUpdate({_id: gid, members: {$ne: uid}}, {$push: {members: uid}}).exec();
}

function removeUserFromGroup(uid, gid) {
    return MessageGroup.findByIdAndUpdate(gid, {$pull: {members: uid}}).exec();
}

function createGroup(name) {
    return new MessageGroup({name :name}).save();
}

function deleteGroup(id) {
    MessageGroup.findOneAndDelete({_id: id}).then(() => Message.deleteMany({to: id})).catch(errro => console.log(error));
}

function initUserSub(uid) {
    return new UserSubscriptions({uid: uid}).save();
}

module.exports = { wss, getUserMessages, updateUserViewed, addUserToGroup, removeUserFromGroup, createGroup, deleteGroup, initUserSub };
