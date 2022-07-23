require('dotenv').config()
require('./config/database')
// Initialize DB Connection
// attention, reload cache each restart, every midnight
const config = require('./config/config').getConfig(),
    PORT = config.PORT
const http = require('http')
const { Server } = require('socket.io')
console.log('✔ Bootstrapping Application')
console.log(`✔ Mode: ${config.MODE}`)
console.log(`✔ Port: ${PORT}`)
const {server: app} = require('./config/server')
const server = http.createServer(app)
const io = new Server(server)
io.on('connection', (socket) => {
  console.log('✔ Client connected')
    socket.on('chat', data => { 
      io.emit('user-chat', data)
    })
})

server.listen(PORT).on('error', (err) => {
console.log('✘ Application failed to start')
     console.error('✘', err.message)
     process.exit(0)
    }).on('listening', () => {
     console.log('✔ Application Started')
   })

module.exports = { server }

