export default class Signal {
  _data = []
  _waiting = null
  _stopped = false

  transmit(data) {
    if (this._stopped) {
      throw new Error('Signal stopped')
    }

    if (!this._waiting) {
      this._data.push(data)
      return this
    }

    this._waiting(data)
    this._waiting = null
    return this
  }

  async receive() {
    if (this._data.length) {
      return this._data.shift()
    }

    if (this._stopped) {
      throw new Error('Signal stopped')
    }

    if (this._waiting) {
      throw new Error('Receiver pending')
    }

    return new Promise(resolve =>
      this._waiting = resolve)
  }

  stop() {
    this._stopped = true
    return this
  }

  transmits() {
    return !!this._data.length || !this._stopped
  }
}
