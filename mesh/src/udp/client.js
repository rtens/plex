import udp from 'node:dgram'
import Link from '../link.js'

export default class Client extends Link {
  _host
  _port

  constructor(host, port) {
    super()

    this._host = host
    this._port = port
  }

  send(packet) {
    const socket = udp.createSocket('udp4')
    socket.send(this._flatten(packet), this._port, this._host, () => socket.close())
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
