import test from 'ava'
import Signal from '../../src/signal.js'

test('pending signal', t => {
  const signal = new Signal()

  t.is(signal.transmits(), true)
})

test('stopped signal', async t => {
  const signal = new Signal()
  signal.stop()

  t.is(signal.transmits(), false)
  t.throwsAsync(() => signal.receive(), {
    message: 'Signal stopped'
  })
})

test('stopped signal with data', async t => {
  const signal = new Signal()
  signal.transmit('foo')
  signal.transmit('bar')
  signal.stop()

  t.is(signal.transmits(), true)

  await signal.receive()
  t.is(signal.transmits(), true)

  await signal.receive()
  t.is(signal.transmits(), false)
})

test('transmit after stop', async t => {
  const signal = new Signal()
  signal.stop()

  t.throws(() => signal.transmit('foo'), {
    message: 'Signal stopped'
  })
  t.is(signal.transmits(), false)
  t.throwsAsync(() => signal.receive(), {
    message: 'Signal stopped'
  })
})