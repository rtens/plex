import test from 'ava'
import Signal from '../../src/signal.js'

test('pending signal', t => {
  const signal = new Signal()
  const receiver = signal.receiver()

  t.is(receiver.receiving(), true)
})

test('stopped signal', async t => {
  const signal = new Signal()
    .stop()
  const receiver = signal.receiver()

  t.is(receiver.receiving(), false)
  t.throwsAsync(() => receiver.receive(), {
    message: 'Signal stopped'
  })
})

test('stopped signal with data', async t => {
  const signal = new Signal()
    .transmit('foo')
    .transmit('bar')
    .stop()
  const receiver = signal.receiver()

  t.is(receiver.receiving(), true)

  await receiver.receive()
  t.is(receiver.receiving(), true)

  await receiver.receive()
  t.is(receiver.receiving(), false)
})

test('receive_all', async t => {
  const signal = new Signal()
    .transmit('foo')
    .transmit('bar')
    .stop()

  const receiver = signal.receiver()
  t.deepEqual(await receiver.receive_all(),
    ['foo', 'bar'])
})

test('transmit after stop', async t => {
  const signal = new Signal()
    .stop()

  t.throws(() => signal.transmit('foo'), {
    message: 'Signal stopped'
  })
})