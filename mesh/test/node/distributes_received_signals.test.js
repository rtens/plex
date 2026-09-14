import test from 'ava'
import Cell from '../../../core/src/cell.js'
import Node from '../../src/node.js'
import Link from '../../src/link.js'
import Packet from '../../src/packet.js'

test('no cells', t => {
  const node = new Node()
  const link = node.attach(new Link())

  link.receive(new Packet('one', 'foo'))

  t.pass()
})

test('multiple cells', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const one = node.add(new TestCell())
  const two = node.add(new TestCell())

  link.receive(new Packet('one', 'foo'))

  t.deepEqual(await one.detected, ['foo'])
  t.deepEqual(await two.detected, ['foo'])
})

test('already received packet', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('one', 'foo'))
  link.receive(new Packet('one', 'foo'))

  t.deepEqual(await cell.detected, ['foo'])
})

test('several packets', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('one', 'foo'))
  link.receive(new Packet('two', 'bar'))

  t.deepEqual(await cell.detected, ['foo', 'bar'])
})

test('packet chain', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('one', 'foo').chain())
  link.receive(new Packet('two', 'bar').chain('one'))
  link.receive(new Packet('tre', 'baz').end('two'))

  t.deepEqual(await cell.detected, ['foobarbaz'])
})

test('short chain', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('one', 'foo').chain())
  link.receive(new Packet('two', 'bar').end('one'))

  t.deepEqual(await cell.detected, ['foobar'])
})

test('single-packet chain', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('one', 'foo').end())

  t.deepEqual(await cell.detected, ['foo'])
})

test('interrupted chain', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('one', 'foo').chain())
  link.receive(new Packet('two', 'bar'))
  link.receive(new Packet('tre', 'baz').end('one'))

  t.deepEqual(await cell.detected, ['bar', 'foobaz'])
})

test('out of order chain', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('tre', 'baz').end('two'))
  link.receive(new Packet('one', 'foo').chain())
  link.receive(new Packet('two', 'bar').chain('one'))

  t.deepEqual(await cell.detected, ['foobarbaz'])
})

test('partially out of order chain', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('one', 'foo').chain())
  link.receive(new Packet('two', 'baz').chain('one'))
  link.receive(new Packet('for', 'bar').end('tre'))
  link.receive(new Packet('tre', 'bam').chain('two'))

  t.deepEqual(await cell.detected, ['foobazbambar'])
})

test('error during detection', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  node.add(new class extends Cell {
    detect() { throw 'oops' }
  })

  let on_error
  const caught = new Promise(y => on_error = y)
  node.on_error = e => on_error(e)

  link.receive(new Packet('one', 'foo'))

  t.deepEqual(await caught, 'oops')
})

test('rejection during detection', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  node.add(new class extends Cell {
    detect() { return Promise.reject('oops') }
  })

  let on_error
  const caught = new Promise(y => on_error = y)
  node.on_error = e => on_error(e)

  link.receive(new Packet('one', 'foo'))

  t.deepEqual(await caught, 'oops')
})

test('cleans up buffer', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('two').chain('one'))
  link.receive(new Packet('tre').end('two'))
  link.receive(new Packet('one').chain())

  await cell.detected
  t.deepEqual(node._buffer, {})
})

test('cleans up signals', async t => {
  const node = new Node()
  const link = node.attach(new Link())
  const cell = node.add(new TestCell())

  link.receive(new Packet('two').chain('one'))
  link.receive(new Packet('tre').end('two'))
  link.receive(new Packet('one').chain())

  link.receive(new Packet('uno').chain())
  link.receive(new Packet('dos').end('uno'))

  link.receive(new Packet('bla'))

  await cell.detected
  t.deepEqual(node._signals, {})
})

class TestCell extends Cell {
  detected
  data = []

  async detect(signal) {
    let resolve
    this.detected = new Promise(y => resolve = y)

    let data = ''
    const receiver = signal.receiver()
    while (receiver.receiving()) {
      data += await receiver.receive()
    }
    this.data.push(data)
    resolve(this.data)
  }
}
