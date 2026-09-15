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
}
