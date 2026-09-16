import test from 'ava'
import net from 'node:net'
import Server from '../../../src/tcp/server.js'
import Packet from '../../../src/packet.js'

test('single Packet', async t => {
  const received = await send(Buffer.from(
    '00' +
    'aa2211221122112211221122112211ee' +
    '0003' + 'babafe', 'hex'))

  t.deepEqual(received, new Packet(
    Buffer.from('aa2211221122112211221122112211ee', 'hex'),
    Buffer.from('babafe', 'hex')))
})

test('start of Chain', async t => {
  const received = await send(Buffer.from(
    '01' +
    'aa2211221122112211221122112211ee' +
    '0003' + 'babafe', 'hex'))

  t.deepEqual(received, new Packet(
    Buffer.from('aa2211221122112211221122112211ee', 'hex'),
    Buffer.from('babafe', 'hex'))
    .chain())
})

test('end of Chain', async t => {
  const received = await send(Buffer.from(
    '02' +
    'aa2211221122112211221122112211ee' +
    'bb3344334433443344334433443344ff' +
    '0003' + 'babafe', 'hex'))

  t.deepEqual(received, new Packet(
    Buffer.from('aa2211221122112211221122112211ee', 'hex'),
    Buffer.from('babafe', 'hex'))
    .end(Buffer.from('bb3344334433443344334433443344ff', 'hex')))
})

test('middle of Chain', async t => {
  const received = await send(Buffer.from(
    '03' +
    'aa2211221122112211221122112211ee' +
    'bb3344334433443344334433443344ff' +
    '0003' + 'babafe', 'hex'))

  t.deepEqual(received, new Packet(
    Buffer.from('aa2211221122112211221122112211ee', 'hex'),
    Buffer.from('babafe', 'hex'))
    .chain(Buffer.from('bb3344334433443344334433443344ff', 'hex')))
})

let last_port = 12400

async function send(data) {
  const port = last_port++
  const server = await new Server().listen(port)

  let received = Promise.withResolvers()
  server.receive = packet => received.resolve(packet)

  const client = new net.Socket()
  client.connect(port, 'localhost', () => {
    client.write(data)
    client.destroy()
  })

  received = await received.promise
  await server.break()

  return received
}