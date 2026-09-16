import udp from 'node:dgram'
import Link from '../link.js'
import Packet from '../packet.js'

export default class Server extends Link {
  _socket

  constructor() {
    super()

    this._socket = udp.createSocket('udp4')
    this._socket.on('message', msg => this.receive(this._inflate(msg)))
  }

  async listen(port) {
    const running = Promise.withResolvers()

    this._socket.on('listening', () => running.resolve(this))
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

  _inflate(data) {
    const type = data[0]
    const id = data.subarray(1, 17)

    let i = 17
    let follows = null
    if (type & 2) {
      follows = data.subarray(i, i + 16)
      i += 16
    }

    const size = data.subarray(i, i + 2).readUInt16BE()
    const content = data.subarray(i + 2, i + 2 + size)

    const packet = new Packet(id, content)
    packet.follows = follows
    packet.last = !(type & 1)

    return packet
  }
}