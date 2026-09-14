import test from 'ava'
import Node from '../../src/node.js'
import Link from '../../src/link.js'
import Packet from '../../src/packet.js'

test('one link', t => {
  const node = new Node()
  const link = node.attach(new TestLink())

  link.receive(new Packet('one', 'foo'))

  t.deepEqual(link.sent, [])
})

test('multiple links', t => {
  const node = new Node()
  const one = node.attach(new TestLink())
  const two = node.attach(new TestLink())
  const three = node.attach(new TestLink())

  one.receive(new Packet('one', 'foo'))

  t.deepEqual(one.sent, [])
  t.deepEqual(two.sent, [new Packet('one', 'foo')])
  t.deepEqual(three.sent, [new Packet('one', 'foo')])
})

test('already received packet', t => {
  const node = new Node()
  const one = node.attach(new Link())
  const two = node.attach(new TestLink())

  one.receive(new Packet('one', 'foo'))
  one.receive(new Packet('one', 'foo'))

  t.deepEqual(two.sent, [new Packet('one', 'foo')])
})

test('multiple packets', t => {
  const node = new Node()
  const one = node.attach(new Link())
  const two = node.attach(new TestLink())

  one.receive(new Packet('one', 'foo'))
  one.receive(new Packet('two', 'foo'))

  t.deepEqual(two.sent, [
    new Packet('one', 'foo'),
    new Packet('two', 'foo')])
})

test('error while sending', async t => {
  const node = new Node()
  const one = node.attach(new Link())
  node.attach(new class extends Link {
    send() { throw 'oops' }
  })

  let on_error
  const caught = new Promise(y => on_error = y)
  node.on_error = e => on_error(e)

  one.receive(new Packet('one', 'foo'))

  t.deepEqual(await caught, 'oops')
})

test('rejection while sending', async t => {
  const node = new Node()
  const one = node.attach(new Link())
  node.attach(new class extends Link {
    send() { return Promise.reject('oops') }
  })

  let on_error
  const caught = new Promise(y => on_error = y)
  node.on_error = e => on_error(e)

  one.receive(new Packet('one', 'foo'))

  t.deepEqual(await caught, 'oops')
})

class TestLink extends Link {
  sent = []

  send(p) {
    this.sent.push(p)
  }
}
