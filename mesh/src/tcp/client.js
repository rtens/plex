import net from 'node:net'
import UdpClient from '../udp/client.js'

export default class Client extends UdpClient {
  _socket

  constructor() {
    super()

    this._socket = new net.Socket()
  }

  async connect(host, port) {
    const connected = Promise.withResolvers()
    this._socket.connect(port, host, () => connected.resolve(this))
    return connected.promise
  }

  send(packet) {
    this._socket.write(this._flatten(packet))
  }

  break() {
    super.break()

    const closed = Promise.withResolvers()
    this._socket.on('close', closed.resolve)
    this._socket.destroy()

    return closed.promise
  }
}
