const ChatModel = require('./model/ChatModel');

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("sendMessage", async (data) => {
            console.log(`Message received: ${data}`);
            try {
                const newMessage = new ChatModel({ message: data });
                await newMessage.save();
                console.log("Message saved to DB");
                io.emit("receiveMessage", data);
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};
