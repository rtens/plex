import test from 'ava'
import UdpLink from '../../src/udp_link.js'
import Packet from '../../src/packet.js'

test('single Packet', async t => {
  const server = new TestServer(2222)

  const client = new UdpLink.Client('localhost', 2222)

  client.send(new Packet(Buffer.from('one'), Buffer.from('foo')))

  t.deepEqual(await server.inflated, '006f6e650003666f6f')
})

class TestServer extends UdpLink.Server {
  wait
  inflated = new Promise(y => this.wait = y)

  _inflate(data) {
    this.wait(data.toString('hex'))
    this.break()
  }
}
