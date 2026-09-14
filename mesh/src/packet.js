import crypto from 'node:crypto'

export default class Packet {
  id
  content
  follows = null
  last = true

  constructor(id, content) {
    this.id = id
    this.content = content
  }

  chain(follows = 0) {
    this.follows = follows
    this.last = false
    return this
  }

  end(follows = 0) {
    this.follows = follows
    this.last = true
    return this
  }
}
