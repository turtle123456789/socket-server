const { Server } = require("socket.io")

const PORT = process.env.PORT || 3001

const io = new Server(PORT, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://gacha-self.vercel.app/"
    ]
  },
})

let currentItems = []
let forcedIndex = null

io.on("connection", (socket) => {
  console.log("✅ connected:", socket.id)

  socket.emit("list:update", currentItems)

  socket.on("list:update", (list) => {
    currentItems = list
    forcedIndex = null
    io.emit("list:update", currentItems)
  })

  socket.on("admin:select", (index) => {
    forcedIndex = index
  })

  socket.on("spin", () => {
    if (!currentItems.length) return

    let index

    if (
      forcedIndex !== null &&
      forcedIndex >= 0 &&
      forcedIndex < currentItems.length
    ) {
      index = forcedIndex
    } else {
      index = Math.floor(Math.random() * currentItems.length)
    }

    forcedIndex = null

    io.emit("spin:result", index)
  })
})