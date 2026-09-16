import Node from '../mesh/src/node.js'
import UdpServer from '../mesh/src/udp/server.js'
import TcpServer from '../mesh/src/tcp/server.js'

const udp_port = parseInt(process.argv[2])
const tcp_port = parseInt(process.argv[3])

const node = new Node()
node.attach(await new UdpServer().listen(udp_port))
node.attach(await new TcpServer().listen(tcp_port))

console.log('Server running')