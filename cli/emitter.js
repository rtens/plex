import * as readline from 'node:readline/promises'
import { argv, stdin as input, stdout as output } from 'node:process'
import Cell from '../core/src/cell.js'
import Node from '../mesh/src/node.js'
import Client from '../mesh/src/udp/client.js'

let [host, port] = argv[2].split(':')
port = parseInt(port)

const node = new Node()
node.attach(new Client(host, port))
const cell = node.add(new Cell())

const rl = readline.createInterface({ input, output })

rl.on('SIGINT', () => {
  rl.close()
  process.exit()
})

while (true) {
  const input = await rl.question('> ')
  cell.emit().transmit(Buffer.from(input)).stop()
}
