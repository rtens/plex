export default class Link {
  _broken = false

  send(_packet) { }

  receive(_packet) { }

  break() { this._broken = true }

  broken() { return this._broken }
}