import Cell from '../core/src/cell.js'
import Node from '../mesh/src/node.js'
import Client from '../mesh/src/tcp/client.js'

let [host, port] = process.argv[2].split(':')
port = parseInt(port)

const node = new Node()
node.attach(await new Client().connect(host, port))
node.add(new class extends Cell {
  async detect(signal) {
    console.log((await signal.receiver().receive_all()).toString())
  }
})
