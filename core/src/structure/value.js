import Structure from '../structure.js'

export default class Value extends Structure {

  _data

  constructor(data) {
    super()
    this._data = data
  }

  static from(value) {
    return new Value(Buffer.from(value))
  }

  serialize() {
    return Buffer.concat([
      Buffer.from([Structure.START]),
      this._escape(this._data),
      Buffer.from([Structure.STOP])
    ])
  }

  _escape(data) {
    const escaped = []
    for (const byte of data) {
      if (byte == Structure.STOP || byte == Structure.ESCAPE)
        escaped.push(Structure.ESCAPE)
      escaped.push(byte)
    }
    return Buffer.from(escaped)
  }
}