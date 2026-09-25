import Structure from '../structure.js'
import Value from './value.js'
import List from './list.js'
import None from './none.js'

export default class Deserializer {

  _state
  _current
  _stack
  _escaped

  parse(data) {
    this._state = 'void'
    this._current = new List()
    this._stack = []
    this._escaped = false

    for (let i = 0; i < data.length; i++) {
      this['_parse_' + this._state](data[i])
    }

    return this._current
  }
}