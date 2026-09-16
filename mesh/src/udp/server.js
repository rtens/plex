import udp from 'node:dgram'
import Link from '../link.js'
import Packet from '../packet.js'

export default class Server extends Link {
  _socket

  constructor() {
    super()

    this._socket = udp.createSocket('udp4')
    this._socket.on('message', data =>
      this.receive(Packet.inflate(data)))
  }

  async listen(port) {
    const running = Promise.withResolvers()

    this._socket.on('listening', () =>
      running.resolve(this))
    this._socket.bind(port)

    return running.promise
  }

  async break() {
    super.break()

    const broken = Promise.withResolvers()
    this._socket.on('close', broken.resolve)
    this._socket.close()
    return broken.promise
  }
}