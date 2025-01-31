const express = require('express')
const Chat = require('../model/ChatModel')
const router = express.Router()

/* Get lahat ng messages */
router.get('/getMessages', async(req, res) => {
    try {
        const message = await Chat.find()
        res.status(201).json(message)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

/* create messages */
router.post('/sendMessages', async(req, res) => {
    try {
        const  { message } = req.body
        const newMessage = Chat({ message })
        await newMessage.save()
        res.status(201).json(newMessage)
    } catch(err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router