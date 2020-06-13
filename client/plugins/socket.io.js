import io from 'socket.io-client'
const socket = io(`${process.env.SERVER_URL}:${process.env.SOCKET_PORT}`)

export default socket
