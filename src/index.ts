// src/index.ts

import { createServer } from "node:http"
// createServer from node:http is needed because
// Socket.IO needs a raw HTTP server to attach to
// express alone is NOT enough for socket.io

import { createExpressApp } from "./app/index"
import { Server } from "socket.io"
// Server = the socket.io server class

import { initCheckboxes } from "./store/state"
import { registerSocketHandlers } from "./socket/handler"

async function main() {
  try {

 
    const expressApp = createExpressApp()

    
    const httpServer = createServer(expressApp)

  
    const io = new Server(httpServer, {
      cors: {
        origin: "*",
       
        methods: ["GET", "POST"]
      }
    })

    
    initCheckboxes()

    
    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.id}`)

      registerSocketHandlers(io, socket)
    })

    const PORT = process.env.PORT || 3000

  
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })

  } catch (error) {
    console.error("Error starting server:", error)
  }
}

main()