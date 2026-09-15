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

  constructor(port) {
    super()

    this._socket = udp.createSocket('udp4')

    this._socket.on('message', (msg, info) => {
      console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port)
      this.receive(this._inflate(msg))
    })

    this._socket.on('listening', () =>
      console.log(`Server running on ${port}`))

    this._socket.bind(port)
  }

  break() {
    super.break()
    this._socket.close()
  }

  _inflate(data) {
    return new Packet(Buffer.from('one'), Buffer.from('two'))
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
    return Buffer.concat([
      Buffer.from([0]),
      packet.id,
      size,
      packet.content
    ])
  }
}
