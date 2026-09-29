import Structure from '../structure.js'
import Value from './value.js'
import List from './list.js'
import None from './none.js'

export default class Parser {

  _state = InitState
  _stack = []

  parse(data) {

    for (let i = 0; i < data.length; i++) {
      const trigger = this._trigger(data[i])

      try {
        this._state = this._state[trigger]({
          byte: data[i],
          stack: this._stack,
          size: this._stack.length,
          top: this._stack[this._stack.length - 1]
        })
      } catch (cause) {
        throw new Error(`Error at ${i}: ${cause.message}`, { cause })
      }
    }

    return this
  }

  parsed() {
    return this._stack[0]
  }

  finished() {
    return this._state.name == 'End'
  }

  _trigger(c) {
    if (c == Structure.START && this._state.start)
      return 'start'
    if (c == Structure.STOP && this._state.stop)
      return 'stop'
    if (c == Structure.ESCAPE && this._state.escape)
      return 'escape'
    return 'else'
  }
}

const InitState = {
  name: 'Init',
  start() {
    return StartState
  },
  else({ byte }) {
    throw new Error(`Expected ${Structure.START}, got ${byte}`)
  }
}

const StartState = {
  name: 'Start',
  start: add_push(
    () => new List(),
    () => StartState),
  stop: add_push(
    () => new None(),
    size => size ? ListState : EndState),
  escape: add_push(
    () => Value.from([]),
    () => EscapeState),
  else: add_push(
    byte => Value.from([byte]),
    () => ValueState)
}

function add_push(structure, next) {
  return ({ stack, size, top, byte }) => {
    const s = structure(byte)
    if (size) top.add(s)
    stack.push(s)
    return next(size)
  }
}

const ValueState = {
  name: 'Value',
  stop({ stack, size }) {
    if (size == 1) return EndState
    stack.pop()
    return ListState
  },
  escape() {
    return EscapeState
  },
  else({ top, byte }) {
    top.add(byte)
    return ValueState
  },
}

const ListState = {
  name: 'List',
  start: InitState.start,
  stop: ValueState.stop,
  else: InitState.else
}

const EscapeState = {
  name: 'Escape',
  else: ValueState.else
}

const EndState = {
  name: 'End',
  else() {
    throw new Error('Expected end of data')
  }
}