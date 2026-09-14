import crypto from 'node:crypto'
import Packet from './packet.js'

export default class Packer {

  max_size = 1400

  packed(_packet) { }

  random_id() {
    return Buffer.from(crypto.randomBytes(16))
  }

  async pack(signal) {
    let data = []
    let size = 0

    const receiver = signal.receiver()
    while (receiver.receiving()) {
      let chunk = await receiver.receive()

      while (size + chunk.length >= this.max_size) {
        const d = this.max_size - size
        data.push(chunk.subarray(0, d))
        this._chunk(data)

        chunk = chunk.subarray(d)
        data = []
        size = 0
      }

      data.push(chunk)
      size += chunk.length
    }

    if (size) this._chunk(data)
  }

  _chunk(data) {
    this.packed(new Packet(
      this.random_id(),
      Buffer.concat(data)))
  }
}