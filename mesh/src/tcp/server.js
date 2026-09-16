import net from 'node:net'
import UdpServer from '../udp/server.js'

export default class Server extends UdpServer {
  _socket

  constructor() {
    super()

    this._socket = net.createServer(socket =>
      socket.on('data', msg =>
        this.receive(this._inflate(msg))))
  }

  async listen(port) {
    const listening = Promise.withResolvers()
    this._socket.listen(port, () => listening.resolve(this))
    return listening.promise
  }

  async break() {
    super.break()

    const broken = Promise.withResolvers()
    this._socket.on('close', broken.resolve)
    this._socket.close()

    return broken.promise
  }
}