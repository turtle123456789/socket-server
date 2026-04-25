const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)

// 🔥 CORS CHUẨN PRODUCTION
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://gacha-self.vercel.app"
    ],
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  console.log("✅ connected:", socket.id)

  socket.on("list:update", (list) => {
    io.emit("list:update", list)
  })

  socket.on("spin", () => {
    io.emit("spin:result", Math.floor(Math.random() * 5))
  })
})

// 🔥 test route để check deploy OK
app.get("/", (req, res) => {
  res.send("Socket server OK 🚀")
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log("🚀 running on", PORT)
})