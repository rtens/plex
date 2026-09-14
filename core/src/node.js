import Signal from './signal.js'

export default class Node {
  _cells = []
  _links = []

  _received = {}
  _signals = {}
  _buffer = {}

  add(cell) {
    this._cells.push(cell)
    return cell
  }

  attach(link) {
    this._links.push(link)
    link.receive = packet => this.receive(packet, link)
    return link
  }

  on_error(_error) { }

  receive(packet, source) {
    if (this._already_received(packet)) return

    this._forward(packet, source)
    this._distribute(packet)
  }

  _already_received(packet) {
    const key = packet.identifier + '.' + packet.index
    if (key in this._received) return true

    this._received[key] = true
    return false
  }

  _forward(packet, source) {
    this._links
      .filter(link => link != source)
      .map(link => this._safely(() =>
        link.send(packet)))
  }

  _safely(fn) {
    new Promise(y => y(fn()))
      .catch(e => this.on_error(e))
  }

  _distribute(packet) {
    if (packet.first) {
      this._signals[packet.identifier] = []
      for (const cell of this._cells) {
        const signal = new Signal()
        this._signals[packet.identifier].push(signal)
        this._safely(() => cell.detect(signal))
      }
    }

    if (!(packet.identifier in this._signals)) {
      this._buffer[packet.identifier] = packet
      return
    }

    for (const signal of this._signals[packet.identifier]) {
      signal.transmit(packet.content)
    }

    while (packet.next in this._buffer) {
      this._signals[packet.next] = this._signals[packet.identifier]
      delete this._signals[packet.identifier]

      packet = this._buffer[packet.next]
      delete this._buffer[packet.identifier]

      for (const signal of this._signals[packet.identifier]) {
        signal.transmit(packet.content)
      }
    }

    if (packet.next) {
      this._signals[packet.next] = this._signals[packet.identifier]

    } else {
      for (const signal of this._signals[packet.identifier]) {
        signal.stop()
      }
    }

    delete this._signals[packet.identifier]
  }
}
