import test from 'ava'
import net from 'node:net'
import Client from '../../../src/tcp/client.js'
import Packet from '../../../src/packet.js'

test('single Packet', async t => {
  const server = await start_server()
  const client = await new Client().connect('localhost', server.port)

  client.send(new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('babafe', 'hex')))
  await client.break()

  t.deepEqual(await server.received,
    '00' + '1111' + '0003' + 'babafe')
})

test('start of chain', async t => {
  const server = await start_server()
  const client = await new Client().connect('localhost', server.port)

  client.send(new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('babafefe', 'hex'))
    .chain())
  await client.break()

  t.deepEqual(await server.received,
    '01' + '1111' + '0004' + 'babafefe')
})

test('end of chain', async t => {
  const server = await start_server()
  const client = await new Client().connect('localhost', server.port)

  client.send(new Packet(
    Buffer.from('3131', 'hex'),
    Buffer.from('bace', 'hex'))
    .end(Buffer.from('2121', 'hex')))
  await client.break()

  t.deepEqual(await server.received,
    '02' + '3131' + '2121' + '0002' + 'bace')
})

test('middle of chain', async t => {
  const server = await start_server()
  const client = await new Client().connect('localhost', server.port)

  client.send(new Packet(
    Buffer.from('3131', 'hex'),
    Buffer.from('bace', 'hex'))
    .chain(Buffer.from('2121', 'hex')))
  await client.break()

  t.deepEqual(await server.received,
    '03' + '3131' + '2121' + '0002' + 'bace')
})

test('one-Packet chain', async t => {
  const server = await start_server()
  const client = await new Client().connect('localhost', server.port)

  client.send(new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('baba', 'hex'))
    .end())
  await client.break()

  t.deepEqual(await server.received,
    '00' + '1111' + '0002' + 'baba')
})

let last_port = 12500

function start_server() {
  const port = last_port++

  const received = Promise.withResolvers()
  const server = net.createServer(socket =>
    socket.on('data', msg => {
      received.resolve(msg.toString('hex'))
      server.close()
    }))

  const started = Promise.withResolvers()
  server.listen(port, () => started.resolve({
    port,
    received: received.promise
  }))

  return started.promise
}