export default class Signal {
  _data = []
  _waiting = null
  _stopped = false

  transmit(buffer) {
    if (!this._waiting) {
      this._data.push(buffer)
      return this
    }

    this._waiting(buffer)
    this._waiting = null
    return this
  }

  async receive() {
    if (this._data.length) {
      return this._data.shift()
    }

    return new Promise(resolve =>
      this._waiting = resolve)
  }

  stop() {
    this._stopped = true
    return this
  }

  transmits() {
    return this._data.length || !this._stopped
  }
}
