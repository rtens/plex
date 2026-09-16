import test from 'ava'
import udp from 'node:dgram'
import Server from '../../../src/udp/server.js'
import Packet from '../../../src/packet.js'

test.todo('...')

let last_port = 12200

async function send(data) {
  const port = last_port++
  const server = await new Server().listen(port)

  let received = Promise.withResolvers()
  server.receive = packet => received.resolve(packet)

  const socket = udp.createSocket('udp4')
  socket.send(data, port, 'localhost', () => socket.close())

  received = await received.promise
  await server.break()

  return received
}