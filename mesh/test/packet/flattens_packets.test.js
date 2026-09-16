import test from 'ava'
import Packet from '../../src/packet.js'


test('single Packet', async t => {
  const flat = new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('babafe', 'hex'))
    .flatten()

  t.deepEqual(flat.toString('hex'),
    '00' + '1111' + '0003' + 'babafe')
})

test('start of chain', async t => {
  const flat = new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('babafefe', 'hex'))
    .chain()
    .flatten()

  t.deepEqual(flat.toString('hex'),
    '01' + '1111' + '0004' + 'babafefe')
})

test('end of chain', async t => {
  const flat = new Packet(
    Buffer.from('3131', 'hex'),
    Buffer.from('bace', 'hex'))
    .end(Buffer.from('2121', 'hex'))
    .flatten()

  t.deepEqual(flat.toString('hex'),
    '02' + '3131' + '2121' + '0002' + 'bace')
})

test('middle of chain', async t => {
  const flat = new Packet(
    Buffer.from('3131', 'hex'),
    Buffer.from('bace', 'hex'))
    .chain(Buffer.from('2121', 'hex'))
    .flatten()

  t.deepEqual(flat.toString('hex'),
    '03' + '3131' + '2121' + '0002' + 'bace')
})

test('one-Packet chain', async t => {
  const flat = new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('baba', 'hex'))
    .end()
    .flatten()

  t.deepEqual(flat.toString('hex'),
    '00' + '1111' + '0002' + 'baba')
})