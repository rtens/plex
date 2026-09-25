import Structure from '../structure.js'

export default class None extends Structure {

  serialize() {
    return Buffer.from([2, 3])
  }
}