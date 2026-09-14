import test from 'ava'
import Signal from '../../src/signal.js'

test('transmit before receive', async t => {
  const signal = new Signal()
    .transmit('foo')

  const receiver = signal.receiver()
  t.is(await receiver.receive(), 'foo')
})

test('mutliple chunks', async t => {
  const signal = new Signal()
    .transmit('foo')
    .transmit('bar')
    .transmit('baz')

  const receiver = signal.receiver()
  t.is(await receiver.receive(), 'foo')
  t.is(await receiver.receive(), 'bar')
  t.is(await receiver.receive(), 'baz')
})

test('receive before transmit', async t => {
  const signal = new Signal()

  const receiver = signal.receiver()
  setTimeout(() => signal
    .transmit('foo')
    .transmit('bar'))

  t.is(await receiver.receive(), 'foo')
  t.is(await receiver.receive(), 'bar')
})

test('multiple recievers', async t => {
  const signal = new Signal()

  const one = signal.receiver()
  signal.transmit('foo')
  signal.transmit('bar')

  const two = signal.receiver()
  setTimeout(() => signal.transmit('baz'))

  t.is(await one.receive(), 'foo')
  t.is(await one.receive(), 'bar')
  t.is(await one.receive(), 'baz')

  t.is(await two.receive(), 'foo')
  t.is(await two.receive(), 'bar')
  t.is(await two.receive(), 'baz')
})

test('pending receiver', async t => {
  const signal = new Signal()

  const receiver = signal.receiver()
  receiver.receive()

  t.throwsAsync(() => receiver.receive(), {
    message: 'Receiver pending'
  })
})