import Structure from '../structure.js'

export default class List extends Structure {

  _items = []

  add(structure) {
    this._items.push(structure)
    return this
  }

  at(index) {
    return this._items[index]
  }

  serialize() {
    return Buffer.concat([
      Buffer.from([Structure.START]),
      ...this._items.map(i => i.serialize()),
      Buffer.from([Structure.STOP])
    ])
  }
}