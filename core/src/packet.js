export default class Packet {
  identifier
  content
  next = null
  first = true

  constructor(identifier, content) {
    this.identifier = identifier
    this.content = content
  }

  start(next) {
    this.next = next
    this.first = true
    return this
  }

  chain(next) {
    this.next = next
    this.first = false
    return this
  }

  end() {
    this.next = 0
    this.first = false
    return this
  }
}
