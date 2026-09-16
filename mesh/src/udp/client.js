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
    socket.send(packet.flatten(), this._port, this._host, () =>
      socket.close())
  }
}
