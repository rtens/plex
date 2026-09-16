import test from 'ava'
import Node from '../../src/node.js'
import Cell from '../../../core/src/cell.js'
import Packer from '../../src/packer.js'
import Packet from '../../src/packet.js'

test('one Cell', async t => {
  const node = new Node(new TestPacker(['one']))
  const cell = node.add(new TestCell())

  cell.emit().transmit('foo').stop()

  t.deepEqual(cell.detected, null)
})

test('multiple Cells', async t => {
  const node = new Node(new TestPacker(['one']))
  const cell = node.add(new TestCell())
  const one = node.add(new TestCell())
  const two = node.add(new TestCell())

  cell.emit().transmit('foo').transmit('bar').stop()

  t.deepEqual(cell.detected, null)
  t.deepEqual(await one.detected.promise, ['foobar'])
  t.deepEqual(await two.detected.promise, ['foobar'])
})

class TestCell extends Cell {
  detected = null
  data = []

  async detect(signal) {
    this.detected = Promise.withResolvers()

    let data = ''
    const receiver = signal.receiver()
    while (receiver.receiving()) {
      data += await receiver.receive()
    }
    this.data.push(data)
    this.detected.resolve(this.data)
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