export default class Signal {
  _data = []
  _receivers = []
  _stopped = false

  transmit(chunk) {
    if (this._stopped)
      throw new Error('Signal stopped')

    this._data.push(chunk)
    this._receivers.forEach(r => r.on(chunk))

    return this
  }

  receiver() {
    const receiver = new Signal.Receiver(this)
    this._receivers.push(receiver)
    return receiver
  }

  stop() {
    this._stopped = true
    return this
  }
}

Signal.Receiver = class {
  _signal
  _at = 0
  _wait = null

  constructor(signal) {
    this._signal = signal
  }

  on(chunk) {
    if (!this._wait) return

    this._wait(chunk)
  }

  async receive() {
    if (this._at < this._signal._data.length)
      return this._signal._data[this._at++]

    if (this._wait)
      throw new Error('Receiver pending')

    if (this._signal._stopped)
      throw new Error('Signal stopped')

    this._at++
    return new Promise(resolve => this._wait = resolve)
  }

  async receive_all() {
    const all = []
    while (this.receiving())
      all.push(await this.receive())
    return all
  }

  receiving() {
    return this._at < this._signal._data.length
      || !this._signal._stopped
  }
}