const express = require("express");
const Message = require("../models/Message");
const router = express.Router();

router.get("/room/:room", async (req, res) => {
    const messages = await Message.find({ room: req.params.room });
    res.json(messages);
});

router.post("/message", async (req, res) => {
    const { from_user, room, message } = req.body;
    const newMessage = new Message({ from_user, room, message });
    await newMessage.save();
    res.json({ success: true });
});

module.exports = router;
