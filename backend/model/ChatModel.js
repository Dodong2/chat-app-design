const mongoose = require('mongoose')

const chatSchema = mongoose.Schema(
    { message: { type: String, required: true,} },
    { timestamps: true }
)

const Chat = mongoose.model('messages', chatSchema)
module.exports = Chat
