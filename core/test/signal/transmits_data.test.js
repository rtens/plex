import test from 'ava'
import Signal from '../../src/signal.js'

test('one chunk', async t => {
  const signal = new Signal()
  signal.transmit('foo')

  t.is(await signal.receive(), 'foo')
})

test('mutliple chunks', async t => {
  const signal = new Signal()
  signal.transmit('foo')
  signal.transmit('bar')
  signal.transmit('baz')

  t.is(await signal.receive(), 'foo')
  t.is(await signal.receive(), 'bar')
  t.is(await signal.receive(), 'baz')
})

test('receive before transmit', async t => {
  const signal = new Signal()

  signal.transmit('foo')
  t.is(await signal.receive(), 'foo')

  const wait = signal.receive()
  signal.transmit('bar')
  t.is(await wait, 'bar')

  signal.transmit('baz')
  t.is(await signal.receive(), 'baz')
})

test('too many receivers', async t => {
  const signal = new Signal()

  signal.receive()

  t.throwsAsync(() => signal.receive(), {
    message: 'Receiver pending'
  })
})