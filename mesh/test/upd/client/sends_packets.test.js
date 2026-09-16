import test from 'ava'
import udp from 'node:dgram'
import Client from '../../../src/udp/client.js'
import Packet from '../../../src/packet.js'

test.todo('...')

let last_port = 12300

function start_server() {
  const port = last_port++

  const started = Promise.withResolvers()
  const received = Promise.withResolvers()

  const socket = udp.createSocket('udp4')
  socket.on('message', msg => {
    received.resolve(msg.toString('hex'))
    socket.close()
  })
  socket.on('listening', () => started.resolve({
    port,
    received: received.promise
  }))
  socket.bind(port)

  return started.promise
}