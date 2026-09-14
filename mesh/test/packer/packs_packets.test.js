import test from 'ava'
import Signal from '../../../core/src/signal.js'
import Packet from '../../src/packet.js'
import Packer from '../../src/packer.js'

test('One packet', async t => {
  const packer = new Packer()
  packer.random_id = () => Buffer.from('random')

  let packed
  packer.packed = packet => packed = packet

  await packer.pack(new Signal().transmit(Buffer.from('foo')).stop())

  t.deepEqual(packed, new Packet(Buffer.from('random'), Buffer.from('foo')))
})

test('Multiple packets', async t => {
  const packer = new Packer()
  packer.max_size = 3

  const ids = ['one', 'two', 'tre']
  packer.random_id = () => Buffer.from(ids.shift())

  const packed = []
  packer.packed = packet => packed.push(packet)

  await packer.pack(new Signal()
    .transmit(Buffer.from('foobarbam'))
    .stop())

  t.deepEqual(packed, [
    new Packet(Buffer.from('one'), Buffer.from('foo')),
    new Packet(Buffer.from('two'), Buffer.from('bar')),
    new Packet(Buffer.from('tre'), Buffer.from('bam')),
  ])
})

test('Multiple packets with left', async t => {
  const packer = new Packer()
  packer.max_size = 3

  const ids = ['one', 'two', 'tre']
  packer.random_id = () => Buffer.from(ids.shift())

  const packed = []
  packer.packed = packet => packed.push(packet)

  await packer.pack(new Signal()
    .transmit(Buffer.from('foobarbo'))
    .stop())

  t.deepEqual(packed, [
    new Packet(Buffer.from('one'), Buffer.from('foo')),
    new Packet(Buffer.from('two'), Buffer.from('bar')),
    new Packet(Buffer.from('tre'), Buffer.from('bo')),
  ])
})

test('Mutliple transmits', async t => {
  const packer = new Packer()
  packer.max_size = 3

  const ids = ['one', 'two', 'tre']
  packer.random_id = () => Buffer.from(ids.shift())

  const packed = []
  packer.packed = packet => packed.push(packet)

  await packer.pack(new Signal()
    .transmit(Buffer.from('foo'))
    .transmit(Buffer.from('bar'))
    .transmit(Buffer.from('bo'))
    .stop())

  t.deepEqual(packed, [
    new Packet(Buffer.from('one'), Buffer.from('foo')),
    new Packet(Buffer.from('two'), Buffer.from('bar')),
    new Packet(Buffer.from('tre'), Buffer.from('bo')),
  ])
})