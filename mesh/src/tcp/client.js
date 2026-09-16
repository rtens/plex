import net from 'node:net'
import UdpClient from '../udp/client.js'
import Packet from '../packet.js'

export default class Client extends UdpClient {
  _socket

  constructor() {
    super()

    this._socket = new net.Socket()
    this._socket.on('data', data =>
      this.receive(Packet.inflate(data)))
  }

  async connect(host, port) {
    const connected = Promise.withResolvers()
    this._socket.connect(port, host, () => connected.resolve(this))
    return connected.promise
  }

  send(packet) {
    this._socket.write(packet.flatten())
  }

  break() {
    super.break()

    const closed = Promise.withResolvers()
    this._socket.on('close', closed.resolve)
    this._socket.destroy()

    return closed.promise
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
