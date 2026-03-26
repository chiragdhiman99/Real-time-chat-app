const express = require("express");
const app = express();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const port = 5000;

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected!", socket.id);

  socket.on("sendMessage", (msg) => {
    io.emit("receiveMessage", {
      text: msg,
      id: socket.id,  
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});


server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
