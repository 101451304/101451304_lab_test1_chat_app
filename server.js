require("dotenv").config();
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
const socketIo = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

io.on("connection", (socket) => {
    console.log("New user connected");

    socket.on("joinRoom", ({ username, room }) => {
        socket.join(room);
        socket.broadcast.to(room).emit("message", `${username} has joined the chat`);
    });

    socket.on("chatMessage", (msg) => {
        io.to(msg.room).emit("message", msg);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));
