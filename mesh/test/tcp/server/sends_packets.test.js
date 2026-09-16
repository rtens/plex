import test from 'ava'
import net from 'node:net'
import Client from '../../../src/tcp/client.js'
import Packet from '../../../src/packet.js'

test.todo('...')

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