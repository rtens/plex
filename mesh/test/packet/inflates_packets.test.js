import test from 'ava'
import Packet from '../../src/packet.js'


test('single Packet', async t => {
  const packet = Packet.inflate(Buffer.from(
    '00' +
    'aa2211221122112211221122112211ee' +
    '0003' + 'babafe', 'hex'))

  t.deepEqual(packet, new Packet(
    Buffer.from('aa2211221122112211221122112211ee', 'hex'),
    Buffer.from('babafe', 'hex')))
})

test('start of Chain', async t => {
  const packet = Packet.inflate(Buffer.from(
    '01' +
    'aa2211221122112211221122112211ee' +
    '0003' + 'babafe', 'hex'))

  t.deepEqual(packet, new Packet(
    Buffer.from('aa2211221122112211221122112211ee', 'hex'),
    Buffer.from('babafe', 'hex'))
    .chain())
})

test('end of Chain', async t => {
  const packet = Packet.inflate(Buffer.from(
    '02' +
    'aa2211221122112211221122112211ee' +
    'bb3344334433443344334433443344ff' +
    '0003' + 'babafe', 'hex'))

  t.deepEqual(packet, new Packet(
    Buffer.from('aa2211221122112211221122112211ee', 'hex'),
    Buffer.from('babafe', 'hex'))
    .end(Buffer.from('bb3344334433443344334433443344ff', 'hex')))
})

test('middle of Chain', async t => {
  const packet = Packet.inflate(Buffer.from(
    '03' +
    'aa2211221122112211221122112211ee' +
    'bb3344334433443344334433443344ff' +
    '0003' + 'babafe', 'hex'))

  t.deepEqual(packet, new Packet(
    Buffer.from('aa2211221122112211221122112211ee', 'hex'),
    Buffer.from('babafe', 'hex'))
    .chain(Buffer.from('bb3344334433443344334433443344ff', 'hex')))
})