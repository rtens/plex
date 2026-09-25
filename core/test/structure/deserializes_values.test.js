import test from 'ava'
import Value from '../../src/structure/value.js'
import Deserializer from '../../src/structure/deserializer.js'
import None from '../../src/structure/none.js'

test('missing start', t => {
  const data = Buffer.from([42, 12, 31])
  t.throws(() => new Deserializer().parse(data), {
    message: 'At 0 expected 2 but got 42'
  })
})

test('missing stop', t => {
  const data = Buffer.from([2, 12, 31])
  t.throws(() => new Deserializer().parse(data), {
    message: 'Missing STOP'
  })
})

test('no value', t => {
  const data = Buffer.from('0203', 'hex')
  const structure = new Deserializer().parse(data)
  t.deepEqual(structure, new None())
})

test('some value', t => {
  const data = Buffer.from('02666f6f03', 'hex')
  const structure = new Deserializer().parse(data)
  t.deepEqual(structure, Value.from('foo'))
})

test('escaped stop', t => {
  const data = Buffer.from('022a1b031503', 'hex')
  const structure = new Deserializer().parse(data)
  t.deepEqual(structure, Value.from([42, Value.STOP, 21]))
})

test('escaped escape', t => {
  const data = Buffer.from('022a1b1b1503', 'hex')
  const structure = new Deserializer().parse(data)
  t.deepEqual(structure, Value.from([42, Value.ESCAPE, 21]))
})

test('unescaped start', t => {
  const data = Buffer.from('022a021503', 'hex')
  const structure = new Deserializer().parse(data)
  t.deepEqual(structure, Value.from([42, Value.START, 21]))
})