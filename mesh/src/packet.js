export default class Packet {
  id
  content
  follows = null
  last = true

  constructor(id, content) {
    this.id = id
    this.content = content
  }

  chain(follows = null) {
    this.follows = follows
    this.last = false
    return this
  }

  end(follows = null) {
    this.follows = follows
    this.last = true
    return this
  }

  flatten() {
    const size = Buffer.alloc(2)
    size.writeUInt16BE(this.content.length)

    let type = 0
    if (!this.last) type |= 1
    if (this.follows) type |= 2

    return Buffer.concat([
      Buffer.from([type]),
      this.id,
      this.follows || Buffer.from([]),
      size,
      this.content
    ])
  }

  static inflate(data) {
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
