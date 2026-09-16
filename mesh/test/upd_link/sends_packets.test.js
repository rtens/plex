import test from 'ava'
import udp from 'node:dgram'
import UdpLink from '../../src/udp_link.js'
import Packet from '../../src/packet.js'

test('single Packet', async t => {
  const server = await start_server()
  const client = new UdpLink.Client('localhost', server.port)

  client.send(new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('babafe', 'hex')))

  t.deepEqual(await server.received,
    '00' + '1111' + '0003' + 'babafe')
})

test('start of chain', async t => {
  const server = await start_server()
  const client = new UdpLink.Client('localhost', server.port)

  client.send(new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('babafefe', 'hex'))
    .chain())

  t.deepEqual(await server.received,
    '01' + '1111' + '0004' + 'babafefe')
})

test('end of chain', async t => {
  const server = await start_server()
  const client = new UdpLink.Client('localhost', server.port)

  client.send(new Packet(
    Buffer.from('3131', 'hex'),
    Buffer.from('bace', 'hex'))
    .end(Buffer.from('2121', 'hex')))

  t.deepEqual(await server.received,
    '02' + '3131' + '2121' + '0002' + 'bace')
})

test('middle of chain', async t => {
  const server = await start_server()
  const client = new UdpLink.Client('localhost', server.port)

  client.send(new Packet(
    Buffer.from('3131', 'hex'),
    Buffer.from('bace', 'hex'))
    .chain(Buffer.from('2121', 'hex')))

  t.deepEqual(await server.received,
    '03' + '3131' + '2121' + '0002' + 'bace')
})

test('one-Packet chain', async t => {
  const server = await start_server()
  const client = new UdpLink.Client('localhost', server.port)

  client.send(new Packet(
    Buffer.from('1111', 'hex'),
    Buffer.from('baba', 'hex'))
    .end())

  t.deepEqual(await server.received,
    '00' + '1111' + '0002' + 'baba')
})

let last_port = 12300

function start_server() {
  const port = last_port++

  let start
  const started = new Promise(y => start = y)

  let receive
  const received = new Promise(y => receive = y)

  const socket = udp.createSocket('udp4')
  socket.on('message', msg => {
    receive(msg.toString('hex'))
    socket.close()
  })
  socket.on('listening', () => start({ received, port }))
  socket.bind(port)

  return started
}