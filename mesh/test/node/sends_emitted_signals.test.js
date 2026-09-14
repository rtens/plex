import test from 'ava'
import Cell from '../../../core/src/cell.js'
import Node from '../../src/node.js'
import Link from '../../src/link.js'
import Packet from '../../src/packet.js'
import Packer from '../../src/packer.js'

test('no links', t => {
  const node = new Node()
  const cell = node.add(new Cell())

  cell.emit().stop()

  t.pass()
})

test('multiple links', async t => {
  const node = new Node(new TestPacker(['one']))
  const cell = node.add(new Cell())
  const one = node.attach(new TestLink())
  const two = node.attach(new TestLink())

  cell.emit().transmit('foo').stop()

  t.deepEqual(await one.sent, [new Packet('one', ['foo'])])
  t.deepEqual(await two.sent, [new Packet('one', ['foo'])])
})

test('multiple signals', async t => {
  const node = new Node(new TestPacker(['one', 'two']))
  const cell = node.add(new Cell())
  const one = node.attach(new TestLink(2))

  cell.emit().transmit('foo').stop()
  cell.emit().transmit('bar').stop()

  t.deepEqual(await one.sent, [
    new Packet('one', ['foo']),
    new Packet('two', ['bar'])
  ])
})

class TestLink extends Link {
  expected
  collected = []
  sent = new Promise(y => this.done = y)

  constructor(expected = 1) {
    super()
    this.expected = expected
  }

  send(p) {
    this.collected.push(p)
    if (this.collected.length == this.expected)
      this.done(this.collected)
  }
}

class TestPacker extends Packer {

  constructor(ids) {
    super()
    this.ids = ids
  }

  async pack(signal) {
    let content = await signal.receiver().receive_all()
    this.packed(new Packet(this.ids.shift(), content))
  }
}