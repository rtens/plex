import test from 'ava'
import Value from '../../src/structure/value.js'
import Parser from '../../src/structure/parser.js'
import None from '../../src/structure/none.js'

test('missing start', t => {
  const data = Buffer.from([42, 12, 31])
  t.throws(() => new Parser().parse(data), {
    message: 'Error at 0: Expected 2, got 42'
  })
})

test('no value', t => {
  const data = Buffer.from('0203', 'hex')
  const parser = new Parser().parse(data)
  t.deepEqual(parser.parsed(), new None())
})

test('some value', t => {
  const data = Buffer.from('02666f6f03', 'hex')
  const parser = new Parser().parse(data)
  t.deepEqual(parser.parsed(), Value.from('foo'))
})

test('escaped stop', t => {
  const data = Buffer.from('022a1b031503', 'hex')
  const parser = new Parser().parse(data)
  t.deepEqual(parser.parsed(), Value.from([42, Value.STOP, 21]))
})

test('escaped escape', t => {
  const data = Buffer.from('022a1b1b1503', 'hex')
  const parser = new Parser().parse(data)
  t.deepEqual(parser.parsed(), Value.from([42, Value.ESCAPE, 21]))
})

test('escaped first byte', t => {
  const data = Buffer.from('021b2a1503', 'hex')
  const parser = new Parser().parse(data)
  t.deepEqual(parser.parsed(), Value.from([42, 21]))
})

test('unescaped start', t => {
  const data = Buffer.from('022a021503', 'hex')
  const parser = new Parser().parse(data)
  t.deepEqual(parser.parsed(), Value.from([42, Value.START, 21]))
})

test('unfinished', t => {
  const data = Buffer.from([2, 12, 31])
  const parser = new Parser().parse(data)
  t.deepEqual(parser.finished(), false)
  t.deepEqual(parser.parsed(), Value.from([12, 31]))
})

test('multiple chunks', t => {
  const chunk1 = Buffer.from('02666f', 'hex')
  const chunk2 = Buffer.from('6f03', 'hex')
  const parser = new Parser()
    .parse(chunk1)
    .parse(chunk2)
  t.deepEqual(parser.finished(), true)
  t.deepEqual(parser.parsed(), Value.from('foo'))
})