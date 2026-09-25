import test from 'ava'
import Value from '../../src/structure/value.js'
import None from '../../src/structure/none.js'

test('none', t => {
  const data = new None().serialize()
  t.is(data.toString('hex'), '0203')
})

test('some value', t => {
  const data = Value.from('foo').serialize()
  t.is(data.toString('hex'), '02666f6f03')
})

test('escaped stop', t => {
  const data = Value.from([42, 3, 21]).serialize()
  t.is(data.toString('hex'), '022a1b031503')
})

test('escaped escape', t => {
  const data = Value.from([42, 27, 21]).serialize()
  t.is(data.toString('hex'), '022a1b1b1503')
})

test('unescaped start', t => {
  const data = Value.from([42, 2, 21]).serialize()
  t.is(data.toString('hex'), '022a021503')
})