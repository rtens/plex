import Signal from '../../core/src/signal.js'
import Packer from './packer.js'

export default class Node {
  _packer
  _cells = []
  _links = []

  _received = {}
  _signals = {}
  _buffer = {}

  constructor(packer) {
    this._packer = packer || new Packer()
    this._packer.packed = packet => this._packed(packet)
  }

  add(cell) {
    this._cells.push(cell)
    cell.emit = () => this._emit(cell)
    return cell
  }

  attach(link) {
    this._links.push(link)
    link.receive = packet => this._receive(packet, link)
    return link
  }

  on_error(_error) { }

  _packed(packet) {
    this._links.forEach(l => l.send(packet))
  }

  _emit(emitter) {
    const signal = new Signal()
    this._packer.pack(signal)

    for (const cell of this._cells) {
      if (cell == emitter) continue
      cell.detect(signal)
    }

    return signal
  }

  _receive(packet, source) {
    if (this._already_received(packet)) return

    this._forward(packet, source)
    this._distribute(packet)
  }

  _already_received(packet) {
    if (packet.id in this._received) return true

    this._received[packet.id] = true
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
    if (!packet.follows) {
      const signal = new Signal()
      this._signals[packet.id] = signal

      this._cells.forEach(cell =>
        this._safely(() => cell.detect(signal)))

    } else if (!(packet.follows in this._signals)) {
      this._buffer[packet.follows] = packet
      return
    }

    this._transmit(packet)

    while (packet.id in this._buffer) {
      packet = this._buffer[packet.id]
      delete this._buffer[packet.follows]
      this._transmit(packet)
    }
  }

  _transmit(packet) {
    if (packet.follows in this._signals) {
      this._signals[packet.id] = this._signals[packet.follows]
      delete this._signals[packet.follows]
    }

    const signal = this._signals[packet.id]
    signal.transmit(packet.content)

    if (packet.last) {
      signal.stop()
      delete this._signals[packet.id]
    }
  }
}
