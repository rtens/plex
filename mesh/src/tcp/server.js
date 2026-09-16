import net from 'node:net'
import UdpServer from '../udp/server.js'
import Packet from '../packet.js'

export default class Server extends UdpServer {
  _clients = []
  _socket

  constructor() {
    super()

    this._socket = net.createServer(socket => {
      this._clients.push(socket)
      socket.on('data', data =>
        this.receive(Packet.inflate(data)))
      socket.on('error', () =>
        this._clients = this._clients.filter(c => c != socket))
      socket.on('close', () =>
        this._clients = this._clients.filter(c => c != socket))
    })
  }

  async listen(port) {
    const listening = Promise.withResolvers()
    this._socket.listen(port, () => listening.resolve(this))
    return listening.promise
  }

  send(packet) {
    console.log(this._clients.length)
    this._clients.forEach(client =>
      client.write(packet.flatten()))
  }

  async break() {
    super.break()

    const broken = Promise.withResolvers()
    this._socket.on('close', broken.resolve)
    this._socket.close()

    return broken.promise
  }

  _flatten(packet) {
    const size = Buffer.alloc(2)
    size.writeUInt16BE(packet.content.length)

    let type = 0
    if (!packet.last) type |= 1
    if (packet.follows) type |= 2

    return Buffer.concat([
      Buffer.from([type]),
      packet.id,
      packet.follows || Buffer.from([]),
      size,
      packet.content
    ])
  }
}