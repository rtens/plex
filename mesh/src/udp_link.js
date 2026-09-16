import udp from 'node:dgram'
import Link from './link.js'
import Packet from './packet.js'

export default class UdpLink extends Link {
  _client
  _server

  constructor(client, server) {
    super()

    this._client = client
    this._server = server

    server.receive = packet => this.receive(packet)
  }

  send(packet) {
    this._client.send(packet)
  }

  break() {
    super.break()
    this._server.break()
  }
}

UdpLink.Server = class extends Link {
  _socket

  constructor() {
    super()

    this._socket = udp.createSocket('udp4')
    this._socket.on('message', msg => this.receive(this._inflate(msg)))
  }

  async run(port) {
    let done
    const wait = new Promise(y => done = y)

    this._socket.on('listening', () => done(this))
    this._socket.bind(port)

    return wait
  }

  async break() {
    super.break()

    let done
    const wait = new Promise(y => done = y)

    this._socket.on('close', () => done())
    this._socket.close()

    return wait
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

UdpLink.Client = class extends Link {
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
